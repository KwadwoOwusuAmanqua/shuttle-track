import {Bell, MapPin, Navigation, Clock, ChevronRight, Users, CalendarCheck} 
from "lucide-react";
import {useNavigate } from "react-router-dom";
import MapView from "../components/map/MapView";

import '../styles/home.css';



const HomePage=()=>{


  const navigate=useNavigate();



  return (
    <div className="home-page">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="brand">
            <span className="brandIcon">
              <Navigation size={16} strokeWidth={2.5} color="#fff" />
            </span>
            <span className='brandName'>
              Campus Transit
            </span>
          </div>
          <button className="bellBtn" aria-label="Notifications">
            <Bell size={22} strokeWidth={1.8} />
          </button>
        </header>

        {/* ── Scrollable content ── */}
        <div className="scroll">
          {/* Hero banner */}
          <section className="hero">
            <div className="heroBg" />
            <div className="heroContent">
              <h2 className="heroHeading">
                Track Campus Shuttles in Real Time
              </h2>
              <p className="heroSub">
                Live updates for all university routes and stops.
              </p>
              <button className="heroBtn" onClick={()=>navigate("/map")}>
                <Navigation size={14} strokeWidth={2.5} />
                Track Now
              </button>
            </div>
          </section>

          {/* Quick Features */}
          <section className="section">
            <h3 className="sectionTitle">Quick Features</h3>
            <div className="featureList">
              
              <button className="featureRow">
                  <span className="featureIcon"><MapPin size={20} /></span>
                  <span className="featureText">
                    <span className="featureTitle">Live Tracking</span>
                    <span className="featureSub">Precise GPS shuttle locations</span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="featureChevron"
                    strokeWidth={2}
                  />
                </button>

                <button className="featureRow">
                  <span className="featureIcon"><CalendarCheck size={20} /></span>
                  <span className="featureText">
                    <span className="featureTitle">Schedule</span>
                    <span className="featureSub">Schedules and detour alerts</span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="featureChevron"
                    strokeWidth={2}
                  />
                </button>

                <button className="featureRow">
                  <span className="featureIcon"><Clock size={20} /></span>
                  <span className="featureText">
                    <span className="featureTitle">Estimated Arrival</span>
                    <span className="featureSub">Wait times for your stop</span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="featureChevron"
                    strokeWidth={2}
                  />
                </button>
            </div>
          </section>


          <section className="section">
            <div className="sectionHeader">
              <h3 className="sectionTitle">
                Recent Shuttle Activity
              </h3>
              <button className="viewAll">View All</button>
            </div>

            <div className="activityCard">
              {/* Card header */}
              <div className="activityHeader">
                <div className="activityBusIcon">
                  <Navigation size={14} color="#2b35af" strokeWidth={2.5} />
                </div>
                <div className="activityInfo">
                  <span className="activityRoute">
                    Blue Line • Bus #24
                  </span>
                  <span className="activityLocation">
                    Arrived at Main Quad
                  </span>
                </div>
                <span className="onTimeBadge">ON TIME</span>
              </div>

              {/* Map placeholder */}
              <div className="mapPlaceholder" >
                </div>

              {/* Card footer */}
              <div className="activityFooter">
                <span className="footerStat">
                  <Users size={13} strokeWidth={2} />
                  12
                  <span className="footerLabel">Passengers</span>
                </span>
                <span className="footerTime">2 mins ago</span>
              </div>
            </div>
          </section>

          {/* Bottom padding so content clears the tab bar */}
          <div className="bottomPad" />
        </div>
    </div> 
  );
}

export default HomePage;