import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
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

export default function App() {
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
      title: "Mapa de Armonía Operativa",
      description:
        "Diagnóstico estratégico para entender tu caos actual y trazar un plan claro de automatización.",
      features: [
        "Revisión de procesos, Excel, WhatsApp/LINE y tareas manuales",
        "Identificación de cuellos de botella y errores críticos",
        "Mapa de oportunidades de automatización priorizado",
        "Hoja de ruta clara para pasar del caos al flujo"
      ]
    },
    {
      icon: <Workflow className="w-12 h-12" />,
      title: "HarmonyFlow System",
      description:
        "Sistema automático y centralizado que reemplaza el Excel eterno y organiza tu operación en un solo flujo.",
      features: [
        "Centralización de datos en una base moderna (Supabase / PostgreSQL)",
        "Automatización con n8n + IA para tareas repetitivas",
        "Integración con WhatsApp, LINE, Google Calendar y más",
        "Panel o app interna hecha a medida para tu equipo"
      ]
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Armonía Continua",
      description:
        "Mantenimiento y optimización mensual para que tu sistema evolucione contigo sin volver al caos.",
      features: [
        "Monitoreo de flujos y corrección de errores",
        "Ajustes por cambios en tu operación",
        "Nuevas automatizaciones pequeñas cada mes",
        "Soporte y mejora continua de tus sistemas"
      ]
    }
  ];

  const projects = [
    {
      title: "WorkTrack – Sistema de Órdenes de Producción",
      description:
        "App de control y seguimiento para empresas japonesas con módulos de órdenes, clientes, producción y trazabilidad",
      tags: ["React", "TypeScript", "Linux", "Spring Boot"],
      image:
        "/images/worktrack.png"
    },
    {
      title: "Sistema de Reservas Automatizado",
      description:
        "Chatbot en WhatsApp/n8n que agenda, confirma y gestiona citas sin intervención humana, con integración a Google Calendar",
      tags: ["n8n", "WhatsApp", "Google Calendar", "Webhooks"],
      image:
        "/images/reservaciones.png"
    },
    {
      title: "Asistente de Ventas - Maquinaria Pesada",
      description:
        "Bot que recibe mensajes, cotiza automáticamente, registra datos en CRM y envía PDF. Automatización completa del flujo comercial",
      tags: ["n8n", "WhatsApp", "CRM", "PDF Generation"],
      image:
        "/images/cotizaciones.png"
    },
    {
      title: "Sistema Administratio – Matriz de Riesgos",
      description:
        "App para evaluar, visualizar y priorizar riesgos operativos en empresas japonesas, con matrices dinámicas y seguimiento de acciones",
      tags: ["TypeScript", "PostgreSQL", "React", "Supabase"],
      image:
        "/images/matrizriesgos.png"
    }
  ];

  const testimonials = [
    {
      name: "Director Comercial",
      role: "CDMX",
      content:
        "Gracias a TenryuAG dejamos de perder tiempo en tareas repetitivas. Hoy todo se actualiza solo y nuestro equipo por fin puede enfocarse en vender.",
      avatar: "DC"
    },
    {
      name: "Gerente de Operaciones",
      role: "México",
      content:
        "Logramos automatizar el 80% de la atención por WhatsApp. La experiencia fue clara, profesional y siempre confiable.",
      avatar: "GO"
    },
    {
      name: "Cliente Corporativo",
      role: "Sector Financiero - Japón",
      content:
        "Excelente comunicación, calidad en el desarrollo y resultados visibles desde la primera semana.",
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
              {["Inicio", "Servicios", "Sobre Mí", "Proyectos", "Testimonios", "Contacto"].map(
                (item, index) => {
                  const sectionId = ["home", "services", "about", "projects", "testimonials", "contact"][index];
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(sectionId)}
                      className={`transition-colors ${
                        activeSection === sectionId
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                }
              )}
              <Button onClick={() => scrollToSection("contact")}>Contáctame</Button>
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
              {["Inicio", "Servicios", "Sobre Mí", "Proyectos", "Testimonios", "Contacto"].map(
                (item, index) => {
                  const sectionId = ["home", "services", "about", "projects", "testimonials", "contact"][index];
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(sectionId)}
                      className="block w-full text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </button>
                  );
                }
              )}
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
                  Automatización & Sistemas a Medida
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              >
                Flujo claro.
                <br />
                Operación estable.
                <br />
                <span className="text-primary">Armonía en cada proceso.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground max-w-2xl"
              >
                Transformo el caos de Excel y procesos manuales en sistemas automáticos, centralizados
                y elegantes que liberan tiempo, reducen errores y devuelven claridad y armonía a tu
                operación.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" onClick={() => scrollToSection("contact")} className="group">
                  Iniciar Proyecto
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("services")}
                >
                  Ver Cómo Trabajo
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
                  <div className="text-sm text-muted-foreground">Proyectos completados</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-primary">90%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción cliente</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-primary">4+</div>
                  <div className="text-sm text-muted-foreground">Años de experiencia en Japón</div>
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
              Servicios
            </Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">Del Caos al Flujo, Paso a Paso</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tres servicios diseñados para llevar tu negocio desde el Excel eterno hasta un sistema
              automático, claro y en armonía.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
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
                    <h3 className="text-2xl mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
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
                Sobre TenryuAG
              </Badge>
              <h2 className="text-4xl sm:text-5xl">Disciplina, Creatividad y Armonía</h2>
              <p className="text-lg text-muted-foreground">
                Con más de 4 años de experiencia como desarrollador en Japón, integro disciplina
                japonesa, creatividad mexicana y tecnología moderna para crear flujos automáticos que
                combinan claridad, estabilidad y armonía.
              </p>
              <p className="text-lg text-muted-foreground">
                Estoy especializado en automatizaciones con IA, integraciones empresariales y
                desarrollo full-stack con React y Spring Boot. He trabajado en proyectos
                corporativos para empresas japonesas en sectores financiero, manufactura y consultoría.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4>Entregas Puntuales</h4>
                    <p className="text-sm text-muted-foreground">
                      Plazos claros y realistas, respetando tu operación
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
                    <h4>Enfoque en Resultados</h4>
                    <p className="text-sm text-muted-foreground">
                      Menos caos, más control y tiempo para lo importante
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
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Portafolio</Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">Proyectos Destacados</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Algunos ejemplos de soluciones que he desarrollado
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
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
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
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
              Testimonios
            </Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">Lo Que Dicen Mis Clientes</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
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
                      <h4>{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
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
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Contacto</Badge>
            <h2 className="text-4xl sm:text-5xl mb-4">¿Listo Para Empezar?</h2>
            <p className="text-xl text-muted-foreground">
              Cuéntame cómo trabajas hoy y diseñamos juntos el flujo que tu negocio necesita.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 border-border/50">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2">
                      Nombre
                    </label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2">
                    Asunto
                  </label>
                  <Input id="subject" placeholder="¿En qué puedo ayudarte?" />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntame más sobre tu negocio, qué haces hoy y qué te gustaría automatizar..."
                    rows={6}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group">
                  Enviar Mensaje
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

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
          <p>© 2025 TenryuAG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}