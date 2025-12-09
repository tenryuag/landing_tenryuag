import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  Code2,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Clock,
  Target,
  Workflow,
  Database,
  Lightbulb
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Card3D } from "./components/Card3D";
import { FloatingIcon } from "./components/FloatingIcon";
import { InteractiveCursor } from "./components/InteractiveCursor";
import { ParticleField } from "./components/ParticleField";
import { SkillBar3D } from "./components/SkillBar3D";
import { ContactForm } from "./components/ContactForm";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

export default function App() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "about", "projects", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Servicios paquetizados según Fase 1 (Mapa, HarmonyFlow, Armonía Continua)
  const services = [
    {
      icon: <Lightbulb className="w-12 h-12" />,
      titleKey: "services.map.title",
      descriptionKey: "services.map.description",
      featuresKey: "services.map.features"
    },
    {
      icon: <Workflow className="w-12 h-12" />,
      titleKey: "services.harmonyFlow.title",
      descriptionKey: "services.harmonyFlow.description",
      featuresKey: "services.harmonyFlow.features"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      titleKey: "services.continuousHarmony.title",
      descriptionKey: "services.continuousHarmony.description",
      featuresKey: "services.continuousHarmony.features"
    }
  ];

  const projects = [
    {
      titleKey: "projects.worktrack.title",
      descriptionKey: "projects.worktrack.description",
      tags: ["React", "TypeScript", "Linux", "Spring Boot"],
      image: "/images/worktrack.png"
    },
    {
      titleKey: "projects.reservations.title",
      descriptionKey: "projects.reservations.description",
      tags: ["n8n", "WhatsApp", "Google Calendar", "Webhooks"],
      image: "/images/reservaciones.png"
    },
    {
      titleKey: "projects.sales.title",
      descriptionKey: "projects.sales.description",
      tags: ["n8n", "WhatsApp", "CRM", "PDF Generation"],
      image: "/images/cotizaciones.png"
    },
    {
      titleKey: "projects.administratio.title",
      descriptionKey: "projects.administratio.description",
      tags: ["TypeScript", "PostgreSQL", "React", "Supabase"],
      image: "/images/matrizriesgos.png"
    }
  ];

  const testimonials = [
    {
      nameKey: "testimonials.commercialDirector.name",
      roleKey: "testimonials.commercialDirector.role",
      contentKey: "testimonials.commercialDirector.content",
      avatar: "DC"
    },
    {
      nameKey: "testimonials.operationsManager.name",
      roleKey: "testimonials.operationsManager.role",
      contentKey: "testimonials.operationsManager.content",
      avatar: "GO"
    },
    {
      nameKey: "testimonials.corporateClient.name",
      roleKey: "testimonials.corporateClient.role",
      contentKey: "testimonials.corporateClient.content",
      avatar: "CC"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <InteractiveCursor />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">TenryuAG</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {["home", "services", "about", "projects", "testimonials", "contact"].map(
                (sectionId) => {
                  return (
                    <button
                      key={sectionId}
                      onClick={() => scrollToSection(sectionId)}
                      className={`transition-colors ${
                        activeSection === sectionId
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t(`nav.${sectionId}`)}
                    </button>
                  );
                }
              )}
              <LanguageSwitcher />
              <Button onClick={() => scrollToSection("contact")}>{t('nav.contactMe')}</Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {["home", "services", "about", "projects", "testimonials", "contact"].map(
                (sectionId) => {
                  return (
                    <button
                      key={sectionId}
                      onClick={() => scrollToSection(sectionId)}
                      className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(`nav.${sectionId}`)}
                    </button>
                  );
                }
              )}
              <div className="pt-4">
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div style={{ opacity, scale }} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  {t('hero.badge')}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              >
                {t('hero.title')}
                <br />
                {t('hero.subtitle1')}
                <br />
                <span className="text-primary">{t('hero.subtitle2')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-2xl"
              >
                {t('hero.description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" onClick={() => scrollToSection("contact")} className="group">
                  {t('hero.startProject')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("services")}
                >
                  {t('hero.seeHowIWork')}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-8 pt-8"
              >
                <div>
                  <div className="text-3xl font-semibold text-primary">20+</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.projects')}</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-primary">90%</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.satisfaction')}</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-primary">4+</div>
                  <div className="text-sm text-muted-foreground">{t('hero.stats.experience')}</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1644337540803-2b2fb3cebf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwZGVza3xlbnwxfHx8fDE3NjI5NzEyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20" />
              </div>

              {/* Floating Elements */}
              <FloatingIcon position="top-right">
                <Code2 className="w-8 h-8 text-primary" />
              </FloatingIcon>

              <FloatingIcon position="bottom-left">
                <Zap className="w-8 h-8 text-accent" />
              </FloatingIcon>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden"
      >
        <ParticleField />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t('services.badge')}
            </Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">{t('services.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('services.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="perspective-1000"
              >
                <Card3D>
                  <div className="p-8 h-full">
                    <motion.div
                      className="text-primary mb-4"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-2xl mb-3">{t(service.titleKey)}</h3>
                    <p className="text-muted-foreground mb-6">{t(service.descriptionKey)}</p>
                    <ul className="space-y-2">
                      {(t(service.featuresKey, { returnObjects: true }) as string[]).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-accent/10 text-accent border-accent/20">
                {t('about.badge')}
              </Badge>
              <h2 className="text-4xl sm:text-5xl">{t('about.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('about.description1')}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('about.description2')}
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4>{t('about.punctualDelivery.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('about.punctualDelivery.description')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h4>{t('about.focusOnResults.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('about.focusOnResults.description')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">{t('projects.badge')}</Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">{t('projects.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('projects.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.titleKey}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="overflow-hidden h-full border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={t(project.titleKey)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl mb-2">{t(project.titleKey)}</h3>
                    <p className="text-muted-foreground mb-4">{t(project.descriptionKey)}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t('testimonials.badge')}
            </Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">{t('testimonials.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.nameKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-border/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4>{t(testimonial.nameKey)}</h4>
                      <p className="text-sm text-muted-foreground">{t(testimonial.roleKey)}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{t(testimonial.contentKey)}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">{t('contact.badge')}</Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('contact.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 border-border/50">
              <ContactForm
                onSubmit={(data) => {
                  console.log("Datos del formulario:", data);
                  // Aquí conectarás con tu backend o n8n
                  alert(t('contact.form.successMessage'));
                }}
              />

              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex justify-center gap-6">
                  <a
                    href="https://github.com/tenryuag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a
                    href="https://linkedin.com/in/tenryuag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="mailto:tenryuag@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}