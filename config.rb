require 'open-uri'
require 'mini_magick'
###
# Compass
###

# Susy grids in Compass
# First: gem install compass-susy-plugin
# require 'susy'

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Haml
###

# CodeRay syntax highlighting in Haml
# First: gem install haml-coderay
# require 'haml-coderay'

# CoffeeScript filters in Haml
# First: gem install coffee-filter
# require 'coffee-filter'

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

###
# Page command
###

# Per-page layout changes:
#
# With no layout

with_layout :layout_recruiters do
  page "/Recruiter*"
end
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

# Change the CSS directory
# set :css_dir, "alternative_css_directory"

# Change the JS directory
# set :js_dir, "alternative_js_directory"

# Change the images directory
# set :images_dir, "alternative_image_directory"

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

helpers do

  def domize(string)
    string.gsub(/[^0-9a-z]/i, '').downcase
  end

  def industries_hash
    {"Administration/Sachbearbeitung"=>["Archivierung", "Assistenz", "Auftragsabwicklung/Dateneingabe", "Empfang/Telefonzentrale", "Immobilienverwaltung", "Organisation", "Sachbearbeitung", "Sekretariat", "sonstige Berufe - Administration/Sachbearbeitung"], "Aus- und Weiterbildung"=>["Betriebliche Aus- und Weiterbildung", "Erwachsenenbildung", "Kindergarten & Erziehung", "Kundenschulung", "Professur", "Pädagogik", "Schul- & Universitätsverwaltung", "Schulausbildung", "Sonderschule", "Sport- & Fitnesstraining", "sonstige Berufe - Aus-/Weiterbildung"], "Customer Service/Kundenbetreuung"=>["Call Center", "Flugbegleitung", "Haarpflege & Kosmetik", "Händlerbetreuung", "Kundenbetreuung", "Kundenschulung", "Reservierung & Ticketservice", "Schalterservice", "sonstige Berufe - Customer Service/Kundenbetreuung", "technischer Kundendienst/Hotline"], "Design & Gestaltung"=>["Architektur/Raumgestaltung", "Computer Animation & Multimedia", "Creative Direction", "Grafik/Illustration", "Industriedesign", "Mode & Schmuckdesign", "Photografie, Videogestaltung", "Web/User Interface Design", "sonstige Berufe - Design & Gestaltung"], "Geschäftsleitung/Strategisches Management"=>["Business Analyse", "Consulting", "Filial-/Abteilungsleitung", "Franchising", "Geschäftsbereichsführung", "Geschäftsführung/Vorstand", "Klinik-/Heimleitung", "Mergers & Acquisitions", "Restaurantleitung", "Schul- & Universitätsverwaltung", "Stadtplanung", "Strategie & Planung", "sonstige Berufe - Geschäftsleitung/Strategisches Management"], "Handwerk"=>["Bauleitung", "Beton-/Mauerhandwerk", "Betriebstechnik/Inbetriebnahme", "Dachdecken", "Elektrik/Mechatronik", "Fußbodenverlegung/Malen/Tapezieren", "Heizung/Klima", "Klempnerei/Sanitär", "Metallfacharbeit/Schmiede", "Technisches Zeichnen/CAD", "Vermessen", "Verputzen", "Zimmerei/Tischlerei", "sonstige Berufe - Handwerk"], "Hotel und Gastronomie"=>["Bedienung/Servicekraft", "Bewirtungs-Service", "Gäste-Service", "Kochen/Catering", "Restaurantleitung", "Rezeption", "Sommelier", "sonstige Berufe - Hotel & Gastronomie"], "IT/Informationstechnologie"=>["Benutzerfreundlichkeit (Usability)", "Benutzerservice/Help Desk", "Computer-/Netzwerksicherheit", "Datenbankentwicklung/Administration", "ERP/SAP-Beratung, Einführung, Programmierung", "IT-Consulting", "IT-Projektmanagement", "Software-/Systemarchitektur", "Software-/Web-Entwicklung", "System-/Netzwerkadministration", "Systemprogrammierung", "Telekommunikationstechnik", "Web/User Interface Design", "sonstige Berufe - IT/Informationstechnologie"], "Ingenieurwesen/Entwicklung und Konstruktion"=>["Bauwesen", "Biotechnologie", "Chemietechnologie", "Elektronik", "Energie-/Kerntechnik", "Funktechnik", "Luft- und Raumfahrttechnik", "Maschinenbauwesen/Fahrzeugbau", "Prozesstechnik/Prozeßentwicklung", "Prozeßsteuerung", "Schiffbau", "Technisches Zeichnen/CAD", "Umwelttechnik", "sonstige Berufe - Ingenieurwesen/Entwicklung & Konstruktion"], "Instandhaltung"=>["Bürotechnik", "Elektrik/Mechatronik", "Gebäudemanagment", "Gebäudewartung/-reinigung", "Heizung/Klima", "KFZ-Mechanik/-Elektronik", "Klempnerei/Sanitär", "Landschaftspflege", "Maschinenmontage/-instandhaltung", "Schlosserei", "sonstige Berufe - Instandhaltung"], "Logistik und Transport"=>["Auto & Bus", "Bahn", "Einkauf", "Flugzeug & Schiff", "Gefahrgutabwicklung", "Handelswareneinkauf", "Import-/Exportabwicklung", "Kalkulation", "Kurierdienst", "LKW", "Lieferantenbetreuung", "Maschinen-/Gabelstapler-/-Kranführung", "Materialwirtschaft/Inventur/Disposition", "Spedition", "Verpackung, Versand & Lagerwesen", "sonstige Berufe - Logistik & Transport"], "Marketing"=>["Absatz-/Verkaufsförderung", "Brand Marketing", "Direct-Marketing (CRM)", "Events/Promotion", "Investor-/Public Relations", "Marketingkommunikation", "Marktforschung", "Mediaplanung", "Online-Marketing", "Produktmanagement", "Telemarketing", "Werbung", "sonstige Berufe - Marketing"], "Medizin und Gesundheit"=>["Altenpflege", "Apotheke/Pharmazie", "Ernährungsberatung", "Krankenpflege", "Labor/MTA/CTA/RTA/PTA", "Medizinische Assistenz", "Optik/Akustik", "Physiotherapie/Reha-Service", "Praktische Medizin", "Psychologie", "Rettungsassistenz/Rettungsdienst", "Sozialhilfe", "Sportmedizin", "Tiermedizin/Tierpflege", "Zahnmedizin", "sonstige Berufe - Medizin & Gesundheit"], "Naturwissenschaftliche Forschung"=>["Biologie & Chemie", "Materialwissenschaft & Physik", "Mathematik & Statistik", "Medizinische Forschung", "Neue Produkte - Forschung & Entwicklung", "Pharmazeutische Forschung", "Umwelt & Geologie", "sonstige Berufe - Naturwissenschaftliche Forschung"], "Personalwesen"=>["Betriebliche Aus- und Weiterbildung", "Compensation/Benefits", "Compliance", "Lohn- und Gehaltsabrechnung", "Personalberatung", "Personalbeschaffung/-betreuung", "sonstige Berufe - Personalwesen"], "Produktion"=>["Abfalltechnik", "Betriebs-/Produktionsleitung", "Betriebstechnik", "Chemische-/Pharmazeutische Produktion", "Druckerei", "Fertigungsmontage", "Fertigungstechnologie & Verfahrenstechnik", "Gefahrgutabwicklung", "Gießerei & Formgebung", "Metall- & Schweißtechnik", "Nahrungsmittelproduktion", "Näherei & Schneiderei", "Produktionsplanung", "Telekommunikationstechnik", "Zerspanungstechnik & CNC", "sonstige Berufe - Produktion"], "Projektmanagement"=>["Event-Planung/-Koordination", "IT-Projektmanagement", "Programm Management", "Projekt Management", "sonstige Berufe - Projektmanagement"], "Qualitätswesen"=>["Arbeitsplatzsicherheit", "Bauüberwachung", "Betrugsuntersuchung", "ISO-Zertifizierung", "Qualitätskontrolle", "Six Sigma/Black Belt/TQM", "Software - Qualitätssicherung", "TÜV/Fahrzeuginspektion", "Umweltschutz", "sonstige Berufe - Qualitätswesen"], "Rechnungswesen/Finanzen"=>["Aktuariat", "Buchhaltung", "Controlling", "Corporate Finance", "Debitoren-/Kreditorenbuchhaltung", "Finanz-/Vermögensberatung", "Finanzanalyse", "Fondsmanagment", "Immobilienfinanzierung", "Inkasso/Mahnwesen", "Investment Management", "Kreditprüfung/-bearbeitung", "Risk-Management/Compliance", "Steuer-undFinanzverwaltung", "Steuerberatung", "Underwriting", "Wertpapier-/Warenhandel", "Wirtschaftsprüfung/Revision", "sonstige Berufe - Rechnungswesen/Finanzen"], "Recht"=>["Arbeitsrecht", "Patentrecht", "Steuer-/Wirtschaftsrecht", "Straf-/Zivilrecht", "juristische Assistenz", "sonstige Berufe - Recht"], "Redaktion/Dokumentation"=>["Dokumentation", "Journalismus", "Redaktion/Lektorat", "sonstige Berufe - Redaktion/Dokumentation", "Übersetzung"], "Sicherheit/Zivilschutz"=>["Feuerwehr & Rettungsdienst", "Ladensicherheit", "Polizei", "Sicherheitsdienst", "Strafvollzug", "Verteidigung", "sonstige Berufe - Sicherheit/Zivilschutz"], "Support"=>[], "Vertrieb/Verkauf"=>["Account Management", "Außendienst", "Business Development", "Einzelhandelsverkauf", "Großhandelsverkauf", "Immobilienhandel", "Internationaler Vertrieb", "Technischer Vertrieb", "Telesales", "Touristikbüro & Ticketverkauf", "Verkauf Medien & Werbung", "Versicherungsvertretung", "Vertriebsassistenz", "sonstige Berufe - Vertrieb/Verkauf"], "sonstige Berufe"=>["Heimarbeit", "Karrieremesse", "sonstige Berufe"]}
  end

end



