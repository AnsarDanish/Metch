import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  Trophy,
  Bell,
  BookOpen,
  BarChart3,
  School,
  User,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  Phone,
  Mail,
  Home,
  Settings,
  LogOut,
  ArrowRight,
  PlayCircle,
  Shield,
  Globe,
} from "lucide-react";
import { MayaTemplate } from "maya-template";
import { useNavigate } from "react-router-dom";
import { SMAYAContext } from "../Context";
import "../css/LandingPage.css";
import rais from "../assets/schools/rais.png";
import global from "../assets/schools/global.png";
import kmes from "../assets/schools/kmes.png";
import scholars from "../assets/schools/scholars.png";
import sam from "../assets/schools/sam.png";
import aqsa from "../assets/schools/aqsa.png";
function LandingComponenet({
  isVisible,
  stats,
  features,
  images,
  testimonials,
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="position-relative feature-section overflow-hidden bg- border rounded shadow text-white  py-5">
        <div className="container text-center">
          <div
            className={`transition-opacity ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`transition-opacity ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <h1 className="display-4 fw-bold mb-4">
                Complete <span className="text-warning">School Management</span>
                <br />
                Solution
              </h1>
              <p className="lead mb-4">
                Streamline your educational institution with our comprehensive
                platform. Manage students, teachers, parents, attendance, fees,
                events, and achievements all in one powerful dashboard.
                Streamline your educational institution with our comprehensive
                platform. Manage students, teachers, parents, attendance, fees,
                events, and achievements all in one powerful dashboard.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mb-4">
                {/* <button 
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary btn-lg d-flex align-items-center gap-2"
              >
                Access Dashboard <ArrowRight />
              </button> */}
              </div>

              {/* Stats */}
              <div className="row text-center mt-5">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3 mb-3">
                    <div className="h2 fw-bold">{stat.number}</div>
                    <div className="text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-y bg-light text-light"
        style={{
          backgroundColor: "rgba(34, 34, 60, 0.95);",
        }}
      >
        <div className="container  d-flex flex-column align-items-center justify-content-center">
          <div className="text-center gap-2 mt-4 section-heading">
            <h2 className="fw-bold mb-3">
              Everything You Need in One Platform
            </h2>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-2">
                <div className="shadow-sm p-4 text-center">
                  <div
                    className="mb-3 d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background:
                        "linear-gradient(90deg, #415689ff, #6336ccff)",
                    }}
                  >
                    <feature.icon className="text-warning" />
                  </div>
                  <h5 className="fw-bold text-dark">{feature.title}</h5>
                  <p className="text-dark">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5 bg- border-top school-section text-white">
        <div className="d-flex flex-column justify-content-center align-items-center section-heading-bg">
          <h2 className="fw-bold mb-3">
            {" "}
            Trusted by Institutions of all sizes
          </h2>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-5 py-4 border-bottom">
            {images.map((c) => (
              <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                <div
                  className="p-2 d-flex flex-column gap-2 justify-content-center align-items-center"
                  style={{ width: "150px", minHeight: "130px" }}
                >
                  <img src={c.src} alt={c.alt} class="img-fluid" width="120" />
                </div>
                <div
                  className="fw-semibold text-truncate text-center"
                  style={{
                    maxWidth: "140px",
                    margin: "0 auto",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                  title={c.name}
                >
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-4">
        <div className="container">
          <div className="text-center text-black mb-5 section-heading">
            <h2 className="fw-bold mb-3">Chosen by Principals and Educators</h2>
            <p className="text">
              See what school administrators are saying about our platform
            </p>
          </div>
          <div className="row g-4">
            {testimonials.map((t, index) => (
              <div key={index} className="col-12 col-md-4">
                <div className=" shadow-sm p-4 text-center text-black border-0">
                  <div className="mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="text-warning" />
                    ))}
                  </div>
                  <p className="fst-italic">"{t.content}"</p>
                  <div className="section-text">
                    <div className="fw-semibold">{t.name}</div>
                    <div className="text- small">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg- testimony-section text-white text-center">
        <div className="container section-heading-bg">
          <h2 className="fw-bold mb-3 section-heading-bg">
            Ready to Transform Your School Management?
          </h2>
          <p className="lead mb-4">
            Join hundreds of schools already using SchoolMaya to streamline
            operations and improve outcomes.
          </p>
          {/* <div className="d-flex justify-content-center gap-2 flex-column flex-sm-row">
            <button 
              onClick={() => navigate("/dashboard")}
              className="btn btn-light btn-lg text-primary d-flex align-items-center gap-2"
            >
              Access Dashboard Now <ChevronRight />
            </button>
          </div> */}
          <p className="small mt-3">
            Full-featured demo • No registration required • Instant access
          </p>
          <p className="small mt-3">
            Full-featured demo • No registration required • Instant access
          </p>
        </div>
      </section>
    </>
  );
}
export default function LandingPage() {
  const { token, loca } = useContext(SMAYAContext);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Comprehensive student profiles, attendance tracking, and academic progress monitoring with real-time insights",
    },
    {
      icon: BookOpen,
      title: "Academic Planning",
      description:
        "Complete curriculum management, lesson planning, assignment tracking, and academic calendar integration",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Detailed performance analytics, attendance patterns, financial reports, and institutional metrics",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with role-based access control, data encryption, and automated backups",
    },
    {
      icon: DollarSign,
      title: "Fee Management",
      description:
        "Automated fee collection, payment tracking, financial reporting, and parent payment portals",
    },
    {
      icon: Trophy,
      title: "Achievement Tracking",
      description:
        "Student achievement records, competition results, awards management, and progress celebrations",
    },
  ];

  const images = [
    {
      name: "Aqsa Girls High School",
      src: aqsa,
      alt: "aqsa",
    },
    {
      name: "Global International High School and Jr College",
      src: global,
      alt: "global",
    },
    {
      name: "K.M.E English Medium High School & Junior College",
      src: kmes,
      alt: "KMES",
    },
    {
      name: "Salahuddin Ayyubi Memorial Urdu High School",
      src: sam,
      alt: "SAM",
    },
    {
      name: "The Scholars English High School And Jr College",
      src: scholars,
      alt: "scholar",
    },
    {
      name: "Rais High School And Junior College",
      src: rais,
      alt: "rais",
    },
  ];

  const testimonials = [
    {
      name: "Mrs. Anjali Sharma",
      role: "Principal, Delhi Public School, Jaipur",
      content:
        "Our administrative workload has reduced drastically. Teachers and parents both appreciate how seamless communication has become.",
      rating: 5,
    },
    {
      name: "Mr. Ravi Iyer",
      role: "IT Coordinator, St. Xavier’s High School, Mumbai",
      content:
        "The software is reliable, fast, and easy to use. Integration with our existing systems was smooth — great support from the team!",
      rating: 5,
    },
    {
      name: "Dr. Meenakshi Pillai",
      role: "Vice Principal, Green Valley International School, Bengaluru",
      content:
        "This platform has completely modernized our school operations. Attendance, exams, and reports are now just a few clicks away.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Managed" },
    { number: "500+", label: "Schools Trust Us" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Support Available" },
  ];
  // if (token) {
  //   return (
  //     <MayaTemplate
  //       context={SMAYAContext}
  //       token={token}
  //       fallback={() => {
  //         return (
  //           <LandingComponenet
  //             isVisible={isVisible}
  //             stats={stats}
  //             features={features}
  //             images={images}
  //             testimonials={testimonials}
  //           />
  //         );
  //       }}
  //       appURL={loca}
  //     />
  //   );
  // }

  return (
    <LandingComponenet
      isVisible={isVisible}
      stats={stats}
      features={features}
      images={images}
      testimonials={testimonials}
    />
  );
}
