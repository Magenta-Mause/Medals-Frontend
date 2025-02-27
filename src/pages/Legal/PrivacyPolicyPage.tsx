import { Box, Typography } from "@mui/joy";

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h1" sx={{ mb: 2 }}>
        Datenschutzerklärung
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        In dieser Datenschutzerklärung informieren wir Sie über die Verarbeitung
        personenbezogener Daten bei der Nutzung dieser Website.
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        Verantwortlicher
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Verantwortlich für die Datenverarbeitung ist:
        <br />
        Simon Dietrich
        <br />
        Am Pulverturm 54, 01705 Freital, Deutschland
        <br />
        Email: medals.ageless325@passmail.net
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        Personenbezogene Daten
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Personenbezogene Daten sind alle Informationen, die sich auf eine
        identifizierte oder identifizierbare natürliche Person (betroffene
        Person) beziehen. Als identifizierbar wird eine natürliche Person
        angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu
        einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu
        einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen
        identifiziert werden kann, die Ausdruck der physischen, physiologischen,
        genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen
        Identität dieser natürlichen Person sind.
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        Daten beim Websiteaufruf
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Wenn Sie diese Website nur nutzen, um sich zu informieren und keine
        Daten angeben, dann verarbeiten wir nur die Daten, die zur Anzeige der
        Website auf dem von Ihnen verwendeten internetfähigen Gerät erforderlich
        sind. Das sind insbesondere:
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>jeweils übertragene Datenmenge</li>
          <li>die Website, von der die Anforderung kommt</li>
          <li>Browsertyp und Browserversion</li>
          <li>Betriebssystem</li>
        </ul>
        Rechtsgrundlage für die Verarbeitung dieser Daten sind berechtigte
        Interessen gemäß Art. 6 Abs. 1 lit. f) DSGVO, um die Darstellung der
        Website grundsätzlich zu ermöglichen.
        <br />
        Darüber hinaus können Sie verschiedene Leistungen auf der Website
        nutzen, bei der weitere personenbezogene und nicht personenbezogene
        Daten verarbeitet werden.
      </Typography>
      <Typography level="h2" sx={{ mb: 2 }}>
        Ihre Rechte
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Als betroffene Person haben Sie folgende Rechte:
        <ul>
          <li>
            Sie haben ein Auskunftsrecht bezüglich der Sie betreffenden
            personenbezogenen Daten, die der Verantwortliche verarbeitet (Art.
            15 DSGVO),
          </li>
          <li>
            Sie haben das Recht auf Berichtigung der Sie betreffenden Daten,
            wenn diese unrichtig oder unvollständig gespeichert werden (Art. 16
            DSGVO),
          </li>
          <li>Sie haben das Recht auf Löschung (Art. 17 DSGVO),</li>
          <li>
            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer
            personenbezogenen Daten zu verlangen (Art. 18 DSGVO),
          </li>
          <li>Sie haben das Recht auf Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>
            Sie haben ein Widerspruchsrecht gegen die Verarbeitung der Sie
            betreffenden personenbezogenen Daten (Art. 21 DSGVO),
          </li>
          <li>
            Sie haben das Recht, nicht einer ausschließlich auf einer
            automatisierten Verarbeitung – einschließlich Profiling – beruhenden
            Entscheidung unterworfen zu werden, die Ihnen gegenüber rechtliche
            Wirkung entfaltet oder Sie in ähnlicher Weise erheblich
            beeinträchtigt (Art. 22 DSGVO),
          </li>
          <li>
            Sie haben das Recht, sich bei einem vermuteten Verstoß gegen das
            Datenschutzrecht bei der zuständigen Aufsichtsbehörde zu beschweren
            (Art. 77 DSGVO). Zuständig ist die Aufsichtsbehörde an Ihrem
            üblichen Aufenthaltsort, Arbeitsplatz oder am Ort des vermuteten
            Verstoßes.
          </li>
        </ul>
        Quelle: Muster-Datenschutzerklärung von anwalt.de
      </Typography>
    </Box>
  );
};

export default PrivacyPolicyPage;
