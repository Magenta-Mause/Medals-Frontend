from tqdm import tqdm
import argparse
import logging
import json
import copy

with open('supported_languages.json', 'r', encoding='utf8') as fp:
    SUPPORTED_LANGUAGES = json.load(fp)

torch = None
pipeline = None
TranslationDataset = None
CPU_OR_GPU_DEVICE = None

def init_ml_libs():
    "load torch and transformers here in order not to slow down cli before any action is performed"
    global torch
    global pipeline
    global TranslationDataset
    global CPU_OR_GPU_DEVICE

    from transformers import pipeline as pl
    import torch as to

    torch = to
    pipeline = pl
    CPU_OR_GPU_DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    from transformers.utils import logging
    logging.set_verbosity_error()

    class TranslationDataset(to.utils.data.Dataset):
        def __init__(self, target_paths: dict[str, str], target_language: str, include_token: bool):
            self.items = list(target_paths.items())
            self.target_language = target_language
            self.include_token = include_token

        def __len__(self):
            return len(self.items)

        def __getitem__(self, idx):
            path, text = self.items[idx]
            if self.include_token:
                text = f'>>{self.target_language}<<{text}'
            return path, text
    

def translate_locale_full(target_tree, target_paths, target_language, model = None):
    include_language_token = True

    if not model:
        # download language specific model
        logging.info("Loading language fine-tuned model..")
        model = pipeline('translation', model=f'Helsinki-NLP/opus-mt-en-{target_language}', device=CPU_OR_GPU_DEVICE)
        include_language_token = False
    
    def replace_tree(tree: dict, path: str, value: str):
        dirs = path.split('\x00')
        if len(dirs) == 1:
            tree[dirs[0]] = value
            return
        replace_tree(tree[dirs[0]], '\x00'.join(dirs[1:]), value)

    dataset = TranslationDataset(target_paths, target_language, include_language_token)
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=16, shuffle=False)

    for paths, texts in tqdm(dataloader, desc="Translating"):
        translations = model(list(texts))
        translated_texts = [t['translation_text'] for t in translations]

        for path, translated in zip(paths, translated_texts):
            replace_tree(target_tree, path, translated)


def mask_translation_tree(source_tree, exclude, mask = None):
    target_tree = copy.deepcopy(source_tree)
    translate_paths = {}

    def check_modify_inplace(tree, level = ''):
        # expects a str: str|dict structure ALWAYS, so no lists
        for k, v in tree.items():
            specifier_path = (level+'\x00'+k).strip('\x00')
            if specifier_path in exclude:
                continue

            if type(v) == str:
                translate_paths[specifier_path] = tree[k]
                tree[k] = '{{TRANSLATE}}'
            elif type(v) == dict:
                check_modify_inplace(tree[k], level=specifier_path)
            else:
                logging.error(f"Parsing error: Expected string or sub-dictionary, got: {type(v)}. Aborting.")
                exit(1)

    if not '\x00' in exclude:
        check_modify_inplace(target_tree, level='\x00')
    
    return target_tree, translate_paths


if __name__ == '__main__':
    logging.basicConfig(format="[%(levelname)s]: %(message)s", level=logging.INFO)
    parser = argparse.ArgumentParser("i18n_translate.py", description=f"Translates i18n to other locales, list of supported languages can be viewed in supported_languages.json")
    parser.add_argument('english_source', type=str, help="source locale info (Must be english)")
    parser.add_argument('--to', type=str, action='append', help="add translation target")
    parser.add_argument('--fine-tuned', '-F', action='store_false', default=True, help="utilizes a seperate translation model for every language. This will be more accurate while demanding more space and performance")
    parser.add_argument('--exclude', '-E', type=str, action='append', help="exclude item or tree from translation, result will be cloned to other translations")

    args = parser.parse_args()
    if not args.to:
        logging.error("No target languages specified. Exiting.")
        exit(1)

    with open(args.english_source, 'r') as fp:
        translation_source = json.load(fp)

    exclude_specifiers = list(map(lambda s: s.replace('.', '\x00'), args.exclude or []))
    translation_target, translation_paths = mask_translation_tree(translation_source, exclude_specifiers, mask='{{TRANSLATE}}')
    logging.info(f"Parsed {len(translation_paths)} entries to localize")

    logging.info("Setting up machine learning pipeline")
    init_ml_libs()
    if args.fine_tuned:
        logging.info("Loading multi-language opus model...")
        opus_pipeline = pipeline('translation', model="Helsinki-NLP/opus-mt-en-mul", device=CPU_OR_GPU_DEVICE)

    for target_language in args.to:
        target_language = target_language.lower() if not args.fine_tuned else target_language
        if not SUPPORTED_LANGUAGES.get("multi" if args.fine_tuned else "fine-tuned", {}).get(target_language):
            logging.error(f"Invalid language: {target_language} for {'multi-language' if args.fine_tuned else 'fine-tuned'} setting")
            exit(1)

        lt_tree = copy.deepcopy(translation_target)
        logging.info(f"Translating locale to {SUPPORTED_LANGUAGES.get('multi' if args.fine_tuned else 'fine-tuned')[target_language]}")
        
        if args.fine_tuned:
            translate_locale_full(lt_tree, translation_paths, target_language, model=opus_pipeline)
        else:
            translate_locale_full(lt_tree, translation_paths, target_language)
        
        with open(f'translation_{target_language}.json', 'w') as fp:
            json.dump(lt_tree, fp, indent=4)
