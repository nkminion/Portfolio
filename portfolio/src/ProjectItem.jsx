import { Config } from './data.js';
import './ProjectItem.css'

const ProjectItem = ({ project, isHovered, isAnyHovered, onMouseEnter, onMouseLeave }) => (
  <a href={project.link}>
    <div className={`cont ${isHovered ? 'isHovered' : ''} ${isAnyHovered ? 'isAnyHovered' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className={`box ${isHovered ? 'isHovered' : ''}`}/>
      <h3 className={`title ${isHovered ? 'isHovered' : ''}`}>
        {project.title}
      </h3>
      <p className='desc'>
        {project.description}
      </p>
      <div className='tagcont'>
        {project.tags && project.tags.map((tag,index) => (
          <span key={index} className='tag'>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </a>
);

export default ProjectItem;