import { Config } from './data.js';
import './EducationItem.css'

const EducationItem = ({ education, isHovered, isAnyHovered, onMouseEnter, onMouseLeave }) => (
	<div className={`cont ${isHovered ? 'isHovered' : ''} ${isAnyHovered ? 'isAnyHovered' : ''}`}
		onMouseEnter={onMouseEnter}
		onMouseLeave={onMouseLeave}>
		<div className={`box ${isHovered ? 'isHovered' : ''}`}/>
		<h3 className={`EduTitle ${isHovered ? 'isHovered' : ''}`}>
		{education.title}
		</h3>
		<p className='desc'>
		{education.description}
		</p>
		<div className='tagcont'>
			{education.grades && education.grades.map((tag,index) => (
			<span key={index} className='tag'>
				{tag}
			</span>
			))}
		</div>
	</div>
);

export default EducationItem;