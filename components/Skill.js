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
        psycho: schoolPsycho,
        optical: schoolOptical,
        nature: schoolNature,
        ki: schoolKi,
        faith: schoolFaith,
      };
      
      return (
        <div key={skill.id} className={`${styles.card} ${styles[skill.typeLower]}`}>
            <header>
            <div className={styles['card-left']}>
                <span>{skill.id}</span>
                <h2>{skill.name}</h2>
            </div>
            <div className={styles['card-right']}>
                {schoolImages[skill.schoolLower] && 
                <div className={styles['school-image']}>
                    <Image src={schoolImages[skill.schoolLower]} alt={`${skill.school} school logo`} />
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
                {skill.homing.length > 0 && <strong title="Homing">HOM: {skill.homing.join(' / ')}</strong>}
                {skill.recovery && <strong title="Recovery">REC: {skill.recovery}</strong>}
            </div>
            {(skill.notes || skill.skillText) &&
                <div className={styles['info-box']}>
                {skill.notes && <p><small>{skill.notes}</small></p>}
                <p>{skill.skillText}</p>
                </div>
            }
            </main>
      </div>
      )
}

export default Skill;