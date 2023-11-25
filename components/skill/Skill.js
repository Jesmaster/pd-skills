import Image from "next/image";
import schoolPsycho from "../../styles/school-psycho.png";
import schoolOptical from "../../styles/school-optical.png";
import schoolNature from "../../styles/school-nature.png";
import schoolKi from "../../styles/school-ki.png";
import schoolFaith from "../../styles/school-faith.png";
import { FaCheck, FaInfinity, FaTimes } from "react-icons/fa";
import { GiAbstract103 } from "react-icons/gi";
import styles from "./Skill.module.css";

const Skill = (props) => {
  const { skill, visible } = props;
  const schoolImages = {
    Psycho: schoolPsycho,
    Optical: schoolOptical,
    Nature: schoolNature,
    Ki: schoolKi,
    Faith: schoolFaith,
  };
  const cost = skill.costX ? "X" : skill.cost;
  const str = skill.strX ? "X" : skill.str;
  const use = skill.useInf ? <FaInfinity /> : skill.use;

  return (
    <div
      className={`relative w-full max-w-lg rounded-tr-lg border-l-4 border-black p-3.5 md:p-6 bg-${skill.type.toLowerCase()} ${
        styles.skill
      } ${!visible ? "hidden" : ""}`}
    >
      <header className={"flex items-center justify-between"}>
        <div
          className={`relative flex items-center gap-2 ${styles["skill-header"]}`}
        >
          <span>{`${skill.id < 10 ? "00" : skill.id < 100 ? "0" : ""}${
            skill.id
          }`}</span>
          <h2 className="text-2xl font-bold md:text-4xl">{skill.name}</h2>
        </div>
        <div>
          {schoolImages[skill.school] && (
            <div
              className={`${styles["school-image"]} ${
                skill.school === "Nature" ? styles["school-image-nature"] : ""
              }`}
            >
              <Image
                src={schoolImages[skill.school]}
                alt={`${skill.school} school logo`}
              />
            </div>
          )}
        </div>
      </header>
      <main className={`mt-2 ${styles["info-box"]}`}>
        <div
          className={`bg-gradient-to-r from-[#070b0c] to-[#626365] p-1.5 text-lg text-skill-white`}
        >
          <div className="flex items-center gap-4">
            <strong>COST: {cost}</strong>
            {skill.type === "Attack" && <strong>STR: {str}</strong>}
            {skill.type === "Defense" && <strong>DEF: {str}</strong>}
            <strong className="flex items-center gap-1">
              <GiAbstract103 /> {use}
            </strong>
            <strong>{skill.distance}</strong>
          </div>
          <div className="flex items-center gap-4">
            <strong
              className="flex items-center gap-1"
              title="Usable in the air"
            >
              AIR: {skill.air ? <FaCheck /> : <FaTimes />}
            </strong>
            {skill.velocity && (
              <strong title="Velocity">VEL: {skill.velocity}</strong>
            )}
            {skill.homing && (
              <strong title="Homing">HOM: {skill.homing}</strong>
            )}
            {skill.recovery && (
              <strong title="Recovery">REC: {skill.recovery}</strong>
            )}
          </div>
        </div>
        {(skill.notes || skill.skilltext) && (
          <div className={`p-4`}>
            {skill.notes && <p className="text-base">{skill.notes}</p>}
            <p className="text-xl">{skill.skilltext}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Skill;
