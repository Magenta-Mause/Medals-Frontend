## Medals Frontend Tools

QoL improvement scripts

#### `i18n_translate.py`

Can be used to automagically translate a source i18n locale file to other locales. The script offers support for a general model
capable of translating into a diverse set of languages, as well as models fine-tuned on specific languages which will likely
output better translations while also demanding a more performant computer.

##### Setup

To check out the options this script offers, proceed as follows:

0. (Optionally) set up a virtual environment, certain libraries do not work with python versions >3.11
1. Install the dependencies using `python -m pip install -r requirements.txt` (if you have a NVIDIA GPU, check out the [CUDA installation](#cuda-setup))
2. Obtain the source-locale (english)
3. Run `python i18n_translate.py --help` to view a list of options the script offers

#### CUDA Setup

If you have a NVIDIA GPU, you can install the cuda version of the `torch` module for accelerated translation as follows:

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu126
```

##### Examples

Translate the whole locale to spanish, chinese (simplified) and vietnamese:

```bash
python i18n_translate.py --to spa --to zho_Hant --to vie locale_en.json
```

Translate the all but the locale in the json path `some.things.that.shouldnt.be.translated` into turkish:

```bash
python i18n_translate.py --to tur -E some.things.that.shouldnt.be.translated locale_en.json
```

Use a fine-tuned model to translate the english locale into finnish (which probably is not so easy):

```bash
python i18n_translate.py --to fi -F locale_en.json
```

An example on how you could (at the time of writing) translate the whole i18n en locale to spanish, french and dutch:

```bash
python i18n_translate.py --to nl --to es --to fr -F -E languages -E pages.notFound.h1 -E pages.inDevelopment.h1 -E pages.userRoleError.h1 -E pages.loginPage.logo -E components.genericRespondiveDatagrid.mobileList.pageControl.pageLabels translation.json
```

For a list of supported languages, please see `supported_languages.json`. `multi` contains the languages (codes) for the non-finetuned model
while `fine-tuned` contains a list of finetuned models available for use.

##### Troubleshooting

Since `requirements.txt` eplicitly specifies packet versions for one of the more newer python versions (3.11), installation on older python versions might fail, in that case try to install the dependencies manually like this (at the time of writing, this will not work for versions >3.11 because of the sentencepiece library which requires binaries that have been precompiled for windows for every supported python version):

```
pip install torch tqdm transformers numpy sentencepiece
```
