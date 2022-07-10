import Image from 'next/image'
import schoolPsycho from "../styles/school-psycho.png";
import schoolOptical from "../styles/school-optical.png";
import schoolNature from "../styles/school-nature.png";
import schoolKi from "../styles/school-ki.png";
import schoolFaith from "../styles/school-faith.png";
import { FaCheck, FaInfinity, FaTimes } from "react-icons/fa";
import { GiAbstract103 } from "react-icons/gi"
import styles from '../styles/Home.module.css'

const Skill = (props) => {
    const { skill } = props;
    const schoolImages = {
        Psycho: schoolPsycho,
        Optical: schoolOptical,
        Nature: schoolNature,
        Ki: schoolKi,
        Faith: schoolFaith,
      };
      
      return (
        <div key={skill.id} className={`${styles.card} ${styles[skill.type.toLowerCase()]}`}>
            <header>
            <div className={styles['card-left']}>
                <span>{skill.id}</span>
                <h2>{skill.name}</h2>
            </div>
            <div className={styles['card-right']}>
                {schoolImages[skill.school] && 
                <div className={`${styles['school-image']} ${skill.school === 'Nature' ? styles['school-image-small'] : ''}`}>
                    <Image src={schoolImages[skill.school]} alt={`${skill.school} school logo`} />
                </div>
                }
            </div>
            </header>
            <main>
            <div className={styles.banner}>
                <strong>COST: {skill.cost}</strong>
                {skill.type === 'Attack' && <strong>STR: {skill.str}</strong>}
                {skill.type === 'Defense' && <strong>DEF: {skill.str}</strong>}
                <strong><GiAbstract103 /> {skill.use === '∞' ? <FaInfinity /> : skill.use}</strong>
                <strong>{skill.distance}</strong>
            </div>
            <div className={styles.banner}>
                <strong title="Usable in the air">AIR: {skill.air ? <FaCheck /> : <FaTimes />}</strong>
                {skill.velocity && <strong title="Velocity">VEL: {skill.velocity}</strong>}
                {skill.homing && <strong title="Homing">HOM: {skill.homing}</strong>}
                {skill.recovery && <strong title="Recovery">REC: {skill.recovery}</strong>}
            </div>
            {(skill.notes || skill.skilltext) &&
                <div className={styles['info-box']}>
                {skill.notes && <p><small>{skill.notes}</small></p>}
                <p>{skill.skilltext}</p>
                </div>
            }
            </main>
      </div>
      )
}

export default Skill;