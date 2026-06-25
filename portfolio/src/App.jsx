import { useState, useEffect } from 'react';
import HexGrid from './HexGrid';
import { DesktopIntroMain, DesktopIntroScroll, EducationData, MobileIntro, ProjectData } from './data';
import ProjectItem from './ProjectItem';
import EducationItem from './EducationItem';
import { FiLinkedin,FiGithub } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import './App.css'

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScrollUI = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.03);
    };
    
    window.addEventListener('scroll', handleScrollUI);
    handleScrollUI();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0% -60% 0%' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));

    return () => {
      window.removeEventListener('scroll', handleScrollUI);
      observer.disconnect();
    };
  }, []);

  return (
    <div className='main'>
      
      <HexGrid />

      <main>
        <aside className={isScrolled ? 'scrolled' : ''}>
          <p className={`intro ${isScrolled ? 'scrolled' : ''}`}>
            <span className={`desktopOnlyMain ${isScrolled ? 'scrolled' : ''}`}>
              {DesktopIntroMain}
            </span>
            <span className={`desktopOnlyScroll ${isScrolled ? 'scrolled' : ''}`}>
              {DesktopIntroScroll}
            </span>
            <span className='mobileOnly'>
              {MobileIntro}
            </span>
          </p>
          <div className={`leftdiv ${isScrolled ? 'scrolled' : ''}`}>
            <nav>
              <a className='projecta' href="#projects" style={{ 
                color: activeSection === 'projects' ? '#F0F8FF' : '#555', 
                transform: activeSection === 'projects' ? 'translateX(1rem)' : 'translateX(0)',
              }}>
                <span className='projectLSpan' style={
                  { 
                    width: activeSection === 'projects' ? '2rem' : '1rem', 
                    backgroundColor: activeSection === 'projects' ? 'rgb(45, 155, 255)' : '#555', 
                  }
                } />
                PROJECTS
              </a>
              <a className='educationa' href="#education" style={{ 
                color: activeSection === 'education' ? '#F0F8FF' : '#555', 
                transform: activeSection === 'education' ? 'translateX(1rem)' : 'translateX(0)',
              }}>
                <span className='educationLSpan' style={
                  { 
                    width: activeSection === 'education' ? '2rem' : '1rem',
                    backgroundColor: activeSection === 'education' ? 'rgb(45, 155, 255)' : '#555',
                  }
                } />
                EDUCATION
              </a>
              <a className='activitya' href="#activity" style={{ 
                color: activeSection === 'activity' ? '#F0F8FF' : '#555', 
                transform: activeSection === 'activity' ? 'translateX(1rem)' : 'translateX(0)',
              }}>
                <span className='activityLSpan' style={
                  { 
                    width: activeSection === 'activity' ? '2rem' : '1rem',
                    backgroundColor: activeSection === 'activity' ? 'rgb(45, 155, 255)' : '#555',
                  }
                } />
                ACTIVITY
              </a>
            </nav>
          </div>
          <footer className={`contact ${isScrolled ? 'scrolled' : ''}`}>
            <a href="https://github.com/nkminion" title='GitHub' className='contacta'><FiGithub/></a>
            <a href="https://www.linkedin.com/in/nishant-kalaichelvan/" title='LinkedIn' className='contacta'><FiLinkedin/></a>
            <a href="https://leetcode.com/u/nkminion/" title='LeetCode' className='contacta'><SiLeetcode/></a>
          </footer>
        </aside>

        <div className='rightdiv'>   
          <section id="projects">
            <div className='projectdiv'>
              <span className='projectRSpan'>PROJECTS</span>
            </div>
            
            <div className='projectItem'>
              {ProjectData.map(project => (
                <ProjectItem 
                  key={project.id} 
                  project={project} 
                  isHovered={hoveredItem === project.id}
                  isAnyHovered={hoveredItem !== null}
                  onMouseEnter={() => setHoveredItem(project.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ))}
            </div>
          </section>

          <section id="education">
            <div className='educationdiv'>
              <span className='educationRSpan'>EDUCATION</span>
            </div>
            
            <div className='educationItem'>
              {EducationData.map(education => (
                <EducationItem 
                  key={education.id} 
                  education={education} 
                  isHovered={hoveredItem === education.id}
                  isAnyHovered={hoveredItem !== null}
                  onMouseEnter={() => setHoveredItem(education.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ))}
            </div>
          </section>

          <section id="activity">
            <div className='activitydiv'>
              <span className='activityRSpan'>ACTIVITY</span>
            </div>
            
            <div className='activityCont'>
              <div className='activityItem'>
                <h4 className='activityTitle'>GITHUB</h4>
                <img className='githubImg' src='https://ghchart.rshah.org/2d9bff/nkminion' alt='GitHub Contributions'></img>
              </div>

              <div className='activityItem'>
                <h4 className='activityTitle'>LEETCODE</h4>
                <img className='leetcodeImg' src='https://leetcard.jacoblin.cool/nkminion?theme=dark&font=Lato' alt='LeetCode Profile'></img>
              </div>
            </div>
          </section>
        </div>
        <footer className='mobileContact'>
            <a href="https://github.com/nkminion" className='contacta'><FiGithub/></a>
            <a href="https://www.linkedin.com/in/nishant-kalaichelvan/" className='contacta'><FiLinkedin/></a>
            <a href="https://leetcode.com/u/nkminion/" className='contacta'><SiLeetcode/></a>
        </footer>
        <footer>
            &copy; {new Date().getFullYear()} nkminion. Made with React.
        </footer>
      </main>
    </div>
  );
}