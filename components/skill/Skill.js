import Image from 'next/image'
import schoolPsycho from "../../styles/school-psycho.png";
import schoolOptical from "../../styles/school-optical.png";
import schoolNature from "../../styles/school-nature.png";
import schoolKi from "../../styles/school-ki.png";
import schoolFaith from "../../styles/school-faith.png";
import { FaCheck, FaInfinity, FaTimes } from "react-icons/fa";
import { GiAbstract103 } from "react-icons/gi"
import styles from './Skill.module.css';

const Skill = (props) => {
    const { skill, visible } = props;
    const schoolImages = {
        Psycho: schoolPsycho,
        Optical: schoolOptical,
        Nature: schoolNature,
        Ki: schoolKi,
        Faith: schoolFaith,
      };
      
      return (
        <div className={`p-3.5 md:p-6 relative border-l-4 border-black rounded-tr-lg w-full max-w-lg bg-${skill.type.toLowerCase()} ${styles.skill} ${!visible ? 'hidden' : ''}`}>
            <header className={`flex items-center justify-between`}>
                <div className={`flex items-center relative gap-2 ${styles['skill-header']}`}>
                    <span>{`${skill.id < 10 ? '00' : skill.id < 100 ? '0' : ''}${skill.id}`}</span>
                    <h2 className='font-bold text-2xl md:text-4xl'>{skill.name}</h2>
                </div>
                <div>
                    {schoolImages[skill.school] && 
                    <div className={`${styles['school-image']} ${skill.school === 'Nature' ? styles['school-image-nature'] : ''}`}>
                        <Image src={schoolImages[skill.school]} alt={`${skill.school} school logo`} />
                    </div>
                    }
                </div>
            </header>
            <main className={`mt-2 ${styles['info-box']}`}>
            <div className={`bg-gradient-to-r from-[#070b0c] to-[#626365] text-skill-white text-lg p-1.5`}>
                <div className="flex items-center gap-4">
                    <strong>COST: {skill.cost}</strong>
                    {skill.type === 'Attack' && <strong>STR: {skill.str}</strong>}
                    {skill.type === 'Defense' && <strong>DEF: {skill.str}</strong>}
                    <strong className='flex items-center gap-1'><GiAbstract103 /> {skill.use === '∞' ? <FaInfinity /> : skill.use}</strong>
                    <strong>{skill.distance}</strong>
                </div>
                <div className="flex items-center gap-4">
                    <strong className='flex items-center gap-1' title="Usable in the air">AIR: {skill.air ? <FaCheck /> : <FaTimes />}</strong>
                    {skill.velocity && <strong title="Velocity">VEL: {skill.velocity}</strong>}
                    {skill.homing && <strong title="Homing">HOM: {skill.homing}</strong>}
                    {skill.recovery && <strong title="Recovery">REC: {skill.recovery}</strong>}
                </div>
            </div>
            {(skill.notes || skill.skilltext) &&
                <div className={`p-4`}>
                    {skill.notes && <p className='text-base'>{skill.notes}</p>}
                    <p className='text-xl'>{skill.skilltext}</p>
                </div>
            }
            </main>
      </div>
      )
}

export default Skill;