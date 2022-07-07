import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { parse } from 'papaparse'
import { useEffect, useRef, useState } from "react"
import Skill from '../components/Skill'

export default function Home(props) {
  const { csv } = props;
  const [skills, setSkills] = useState(csv);
  const [filters, setFilters] = useState({
    school: '',
  });

  const schoolSelectRef = useRef();

  const schoolFilterChangeHandler = () => {
    setFilters(prev => {
      return {...prev, school: schoolSelectRef.current.value}
    });
  }

  useEffect(() => {
    setSkills(csv.filter(skill => {
      return !filters.school || filters.school === skill.schoolLower;
    }))
  }, [csv, filters]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Phantom Dust Skills</title>
        <meta name="description" content="Phantom Dust skill list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
         Phantom Dust Skill List
        </h1>

        <form>
          <div className={styles['form-input-wrapper']}>
            <label htmlFor="school">School:</label>
            <select ref={schoolSelectRef} name="school" onChange={schoolFilterChangeHandler}>
              <option value="">- All -</option>
              <option value="psycho">Psycho</option>
              <option value="optical">Optical</option>
              <option value="nature">Nature</option>
              <option value="ki">Ki</option>
              <option value="faith">Faith</option>
            </select>
          </div>
        </form>

        <div className={styles.grid}>
          {skills.map(skill => <Skill key={skill.id} skill={skill} />)}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Site created by <a href="mailto:jesmasterha@gmail.com">Jesmaster</a></p>
        <p>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </p>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const text = 
  `1,Psycho Wave,Psycho,Attack,4,X,1,short,4,STR = target's Level,No,,,,
  2,Psycho Burst,Psycho,Attack,7,X,∞,short,5,STR = target's Level,No,,,,
  3,Psycho Knife,Psycho,Attack,2,2,∞,short,1,,No,,,,Two consecutive hits before knockdown
  4,Psycho Blade,Psycho,Attack,5,5,∞,short,3,,No,,,,
  5,Excalibur,Psycho,Attack,5,7,∞,short,5,Requires: 7 or fewer skills left in arsenal,No,,,,
  6,Debris Bullet,Psycho,Attack,2,X,∞,medium,5,"[Parabola] STR randomly 0,2,or 4.",Yes,4,<Note>,3,"NOTE: 1: Target Running Sideways , 4: Towards or Away"
  7,Stone Shot,Psycho,Attack,2,2,∞,medium,2,[Parabola],Yes,4,<Note>,3,"NOTE: 1: Target Running Sideways , 4: Towards or Away"
  8,Rock Shot,Psycho,Attack,3,4,∞,medium,1,[Parabola],Yes,4,<Note>,3,"NOTE: 1: Target Running Sideways , 4: Towards or Away"
  9,Psycho Spear,Psycho,Attack,3,8,1,medium,3,[Parabola] Add: Pierce effect.,No,4,4,3,
  10,Bomb,Psycho,Attack,3,3,∞,medium,3,[Parabola] Explodes on impact.,Yes,,,,
  11,Cluster Bomb,Psycho,Attack,4,6,∞,medium,2,[Parabola] Explodes on impact. Requires: 7 or fewer skills left in arsenal.,,,,,
  12,Big Bomb,Psycho,Attack,5,5,∞,medium,5,[Parabola] Explodes on impact.,Yes,,,,
  13,Throwing Stone,Psycho,Attack,0,0,∞,long,1,[Parabola],Yes,4,4,3,
  14,Rail Gun,Psycho,Attack,3,6,∞,medium,1,Requires: 7 or fewer skills left in arsenal.,No,5,2,3,
  15,Psycho Sniper,Psycho,Attack,5,4,∞,long,3,,,,,,
  16,Bomb Shot,Psycho,Attack,6,4,∞,long,5,Explodes on impact.,,,0,,
  17,Power,Psycho,Attack,0,X,3,medium,1,[Object] Throws nearby object; STR depends on object. Requires: Available object.,,,4,,
  18,Psycho Kinesis,Psycho,Attack,2,X,∞,medium,2,[Object] Throws nearby object; STR depends on object. Requires: Available object.,,,4,,
  19,Meteor,Psycho,Attack,3,6,1,medium,4,[Fall] Add: Pierce effect.,,,,,
  20,Rain of Stones,Psycho,Attack,3,3,∞,medium,5,[Rain],No,,,,
  21,Rain of Rocks,Psycho,Attack,5,5,∞,medium,1,[Rain],No,,,,
  22,Gravity Press,Psycho,Attack,4,8,1,medium,4,[Hole] Effective against downed opponents.,No,,,,
  23,Timer Mine,Psycho,Attack,1,3,∞,mine,1,Press once to set. Explodes automatically 5 sec later.,No,,,,
  24,Sensor Mine,Psycho,Attack,2,3,∞,mine,1,Detonates when anyone enters blast area.,No,,,,
  25,Remote Mine,Psycho,Attack,1,3,∞,mine,2,Press once to set and again to detonate.,No,,,,
  26,Crystal Wall,Psycho,Defense,1,3,∞,self,1,[Barrier] Add: Anti-Pierce; protects from damage regardless of STR.,No,N/A,N/A,3,
  27,Wall,Psycho,Defense,2,5,∞,self,2,[Barrier] Add: Anti-Pierce; protects from damage regardless of STR.,No,N/A,N/A,3,
  28,Psychic Wall,Psycho,Defense,3,8,∞,self,1,[Barrier] Add: Anti-Pierce; protects from damage regardless of STR.,No,N/A,N/A,3,
  29,Power Shell,Psycho,Defense,2,4,∞,self,1,[Shelter] Add: Anti-Pierce; protects from damage regardless of STR.,No,N/A,N/A,3,
  30,Psycho Shell,Psycho,Defense,3,6,∞,self,2,[Shelter] Add: Anti-Pierce; protects from damage regardless of STR.,No,N/A,N/A,3,
  31,Bend,Psycho,Defense,0,-,1,self,1,[Course],No,N/A,N/A,3,
  32,Change Course,Psycho,Defense,3,-,∞,self,2,[Course],No,N/A,N/A,3,
  33,About Face,Psycho,Defense,2,-,1,self,4,[Course],No,N/A,N/A,3,Sends projectile back at caster (Fall attacks do not go back at caster)
  34,Reverse,Psycho,Defense,5,-,∞,self,5,[Course],No,N/A,N/A,3,Sends projectile back at caster (Fall attacks do not go back at caster)
  35,Confusion Gas,Psycho,Erase,2,-,1,mine,3,Detonates when target enters blast area; erases 1 equipped skill.,No,,,,
  36,Shatter,Psycho,Erase,2,-,∞,capsule,1,Erases capsule you are touching (not Aura).,No,,,,
  37,Crush,Psycho,Erase,3,-,∞,all,4,Erases Environmental crystals from battlefield.,No,,,,
  38,Reduce Gravity,Psycho,Environment,3,-,1,env,1,Increases everyone's movement speed by 20%.,No,N/A,N/A,4,
  39,Abnormal Gravity,Psycho,Environment,3,-,1,env,2,Reduces everyone's movement speed by 20%.,No,N/A,N/A,4,
  40,Confused Gravity,Psycho,Environment,4,-,1,env,5,Inverts everyone's directional controls.,No,N/A,N/A,4,
  41,Vanishing Light,Psycho,Environment,5,-,1,env,4,Prevents everyone from using Optical skills for 1 min.,No,N/A,N/A,4,
  42,Pressure,Psycho,Status,1,-,1,medium,3,Prevents target from moving or using skills for 3 sec.,No,,,,
  43,Lift Up,Psycho,Status,2,-,1,medium,4,Levitates target 10 ft in air for 3 sec. Prevents target from moving or using skills.,,,,,
  44,Alleviate,Psycho,Status,2,-,1,medium,2,Increases target's movement speed by 30%.,,,,,
  45,Brain Concussion,Psycho,Status,3,-,1,medium,3,Inverts target's directional controls for 15 sec.,,,,,
  46,Magnetic Field,Psycho,Status,3,-,1,medium,1,Reduces target's homing accuracy by 30%.,,,,,
  47,Burden,Psycho,Status,4,-,1,medium,4,Reduces target's movement speed by 20%.,,,,,
  48,Freeze Gas,Psycho,Status,4,-,∞,mine,2,Detonates when target enters blast area; freezes target's skill button for 10 sec.,No,,,,
  49,Speed Up,Psycho,Status,2,-,1,self,4,Increases your movement speed by 20%.,No,,,,
  50,Acquisition,Psycho,Status,3,-,1,self,1,Increases your homing accuracy by 20%.,No,N/A,N/A,3,Works on all types of attacks
  51,Skywalk,Psycho,Status,2,-,∞,self,4,Levitate 15 ft in air for 15 sec.,No,,,,
  52,Frighten,Psycho,Special,4,-,∞,auto,1,Briefly stops target's movement.,No,N/A,N/A,3,Works at any range and is instantaneous
  53,Teleportation,Psycho,Special,3,-,1,medium,1,Teleports target to your start point.,,,,,
  54,Dazzle,Psycho,Special,4,-,∞,medium,4,Scrambles target's skill buttons for 10 sec.,,,,,
  55,Bravery Decision,Psycho,Special,0,-,1,self,4,Erases all Aura Particles from your arsenal.,No,N/A,N/A,4,
  56,Levitate,Psycho,Special,2,-,∞,self,2,Levitate 30 ft in air for 15 sec.,No,N/A,N/A,3,for 15 sec. is an error in the game's description (English)
  57,Return,Psycho,Special,2,-,1,self,4,Teleports you to your start point.,No,N/A,N/A,4,
  58,Surprise Attack,Psycho,Special,3,-,1,self,3,Teleports you to target's start point.,No,N/A,N/A,4,
  59,Call,Psycho,Special,3,-,∞,self,2,Sets capsule spawn point to current location for duration of battle.,No,N/A,N/A,4,
  60,Retreat,Psycho,Special,5,-,∞,self,5,Teleports you to one of your capsule spawn points.,No,N/A,N/A,4,
  61,Mist Blade,Optical,Attack,2,3,∞,short,4,Penalty: 1 Level,No,,,,
  62,Laser Blade,Optical,Attack,3,2,∞,short,5,,No,,,,
  63,Photon Wave,Optical,Attack,4,4,∞,mine,3,Explodes around self.,No,,,,
  64,Photon Burst,Optical,Attack,7,7,∞,mine,4,Explodes around self.,No,,,,
  65,Laser,Optical,Attack,1,1,∞,long,1,[Arc],,,,,
  66,Slide Laser,Optical,Attack,2,2,∞,long,2,[Arc],,,,,
  67,Vibration Laser,Optical,Attack,1,3,∞,long,2,[Arc] Requires: Level 10 or higher.,,,,,
  68,Mist Laser,Optical,Attack,1,3,∞,long,1,[Arc] Penalty: 1 Level,,,,,
  69,Double Lasers,Optical,Attack,2,1,∞,long,3,[Arc] Shoots 2 lasers simultaneously,Yes,4,3,3,
  70,Triple Lasers,Optical,Attack,3,1,∞,long,4,[Arc] Fires 3 lasers simultaneously,Yes,4,3,3,
  71,Octolaser,Optical,Attack,8,1,∞,long,5,[Arc] Fires 8 lasers simultaneously,Yes,4,3,3,
  72,Trench Mortar,Optical,Attack,2,2,∞,long,5,[Parabola],,,,,
  73,Gungnir,Optical,Attack,X,X,∞,medium,3,[Parabola] STR = Aura spent on skill. Hold button to charge.,,,,,
  74,Finisher,Optical,Attack,0,X,1,long,4,STR = double your level. Penalty: Level reduced to 0 Requires: maximum Aura,,,,,
  75,Rapid Cannon,Optical,Attack,2,1,∞,long,4,,,,,,
  76,Charged Particle,Optical,Attack,3,4,∞,long,4,Penetrates obstacles. Penalty: 1 Level,,,,,
  77,Ricochet Laser,Optical,Attack,7,2,∞,long,2,Shoots 4 lasers that ricochet off objects.,,4,2,,
  78,Bundled laser,Optical,Attack,3,X,1,long,3,STR = STR of all equipped laser,,,,,
  79,Mist Blaster,Optical,Attack,2,4,∞,medium,3,Penalty: 1 Level,,,,,
  80,Blaster,Optical,Attack,4,4,∞,medium,5,,,,,,
  81,Vibration Blaster,Optical,Attack,4,6,∞,medium,5,Requires: Level 10 or higher,,,,,
  82,Bundled Blaster,Optical,Attack,5,X,1,medium,2,STR = STR of all equipped Blaster,,,,,
  83,Compressor,Optical,Attack,5,X,∞,medium,1,STR = the number of consumed defensive skills.,,,,,
  84,Photon Shower,Optical,Attack,3,2,∞,long,5,[Rain],No,,,,
  85,Killer Satellite,Optical,Attack,5,6,∞,long,3,[Rain],No,1,1,2,Will strike all targets in area of effect
  86,Overheat,Optical,Attack,3,X,1,all,3,[Hole] STR = total Aura Particles on battlefield.,No,,,,
  87,Flash Barrier,Optical,Defense,0,2,∞,self,1,[Barrier],No,N/A,N/A,3,
  88,Laser Barrier,Optical,Defense,1,4,∞,self,2,[Barrier],No,N/A,N/A,3,
  89,Eraser,Optical,Defense,2,3,1,self,4,[Barrier] Add: Erases any attack skill it blocks.,No,N/A,N/A,3,
  90,Photon Barrier,Optical,Defense,2,1,∞,self,3,[Barrier] Add: Retain if you have Aura to use again.,No,N/A,N/A,3,
  91,Paralyze Barrier,Optical,Defense,4,2,∞,self,3,[Barrier] Add: Target can't move for 3 sec.,No,N/A,N/A,3,
  92,Reflect Barrier,Optical,Defense,1,4,1,self,4,[Reflect],No,N/A,N/A,3,
  93,Reflect Mirror,Optical,Defense,4,4,∞,self,5,[Reflect],No,N/A,N/A,3,
  94,Laser Shell,Optical,Defense,2,4,∞,self,1,[Shelter],No,N/A,N/A,3,
  95,Auto Shell,Optical,Defense,3,3,1,self,3,[Shelter] Automatically projects when attacked.,No,N/A,N/A,5,
  96,Interference,Optical,Erase,1,-,1,medium,3,Reduce target's level by 2.,,,,,
  97,Restrain,Optical,Erase,4,-,∞,medium,4,Reduces target's Level by 1. Penalty: 1 level.,,,,,
  98,Panic Gas,Optical,Erase,4,-,1,mine,4,Detonates when target enters blast area; reduces target's Level by 50%.,No,,,,
  99,Eliminate,Optical,Erase,2,-,∞,capsule,1,Erases Aura Particle you are touching.,No,,,,
  100,Evaporate,Optical,Erase,3,-,1,capsule,3,Erases all Aura Particles from battlefield.,No,,,,
  101,Particle Convert,Optical,Erase,4,-,1,capsule,2,Converts all capsules on battle field to Aura Particles.,No,,,,
  102,Meltdown,Optical,Erase,3,-,1,all,2,Reduces everyone's Level by 2 for each of their Aura Particles on battlefield.,No,,,,
  103,Quantum Decay,Optical,Erase,4,-,1,all,4,Reduces everyone's Level by 50%.,No,,,,
  104,Disintegrate,Optical,Erase,6,-,1,all,5,[Hole] Reduces everyone's Level to 0.,No,,,,
  105,Holy Ray,Optical,Environment,3,-,1,env,1,Reduces damage of everyone's attack by 1.,No,N/A,N/A,4,
  106,Reduce Entropy,Optical,Environment,3,-,1,env,1,Prohibits skills with Aura cost of 3 or more (or X).,No,N/A,N/A,4,
  107,Accelerate,Optical,Environment,4,,1,env,4,Skill capsule spawn twice as fast.,No,N/A,N/A,4,
  108,Backdraft,Optical,Environment,4,-,1,env,1,Causes everyone to lose 1 Health for each skill use.,No,N/A,N/A,4,
  109,Optimization,Optical,Environment,5,-,1,env,3,Reduces Aura cost for all skills by 50%.,No,N/A,N/A,4,
  110,Scientism,Optical,Environment,5,-,1,env,4,Prevents everyone from using Faith skills for 1 min.,No,N/A,N/A,4,
  111,Quiet Days,Optical,Environment,5,-,1,env,1,Everyone's skill capsules take twice as long to spawn.,No,N/A,N/A,4,
  112,Paralyze,Optical,Status,4,-,∞,medium,5,Prevents target from moving for 3 sec.,No,4,5,3,"Due to its tracking, it will hit at Long range"
  113,Doze,Optical,Status,5,-,1,medium,2,Reduces damage of target's attack by 1.,,,,,
  114,Gravity Mine,Optical,Status,5,-,∞,mine,5,Detonates when anyone enters blast area; reduces movement speed by 90%.,No,,,,
  115,Optical Camo,Optical,Status,4,-,1,self,4,Add: Invisibility; no one can lock onto you for 15 sec.,No,,,,"No Use time or Delay, instantaneous"
  116,Level Berserk,Optical,Special,2,-,1,medium,4,Doubles target's Level.,No,,,,
  117,Level Amp,Optical,Special,3,-,1,self,3,Increases your level by 2.,No,N/A,N/A,3,
  118,Relearn,Optical,Special,3,-,1,self,5,Automatically captures last skill consumed.,No,,,,
  119,Recall,Optical,Special,5,-,1,self,3,Restores 5 random consumed skills to your arsenal. Requires: Level >10,No,,,,
  120,Level Boost,Optical,Special,7,-,1,self,2,Doubles your Level. Requires: Level >10,No,,,,
  121,Ice Sword,Nature,Attack,2,2,∞,short,4,Add: Freezes target's skill button for 10 sec. Penalty: Aura cost +1 per use.,No,,,,
  122,Lightning Sword,Nature,Attack,2,3,∞,short,2,Add: Erases 1 equipped defensive skill from target. Penalty: Aura cost +1 per use.,No,,,,
  123,Flame Sword,Nature,Attack,3,3,∞,short,2,,No,,,,
  124,Blazing Sword,Nature,Attack,3,5,∞,short,3,Requires: Health 15 or higher,No,,,,
  125,Vacuum Slash,Nature,Attack,3,7,1,short,3,Add: Pierce effect,No,,,,
  126,Sonic Boom,Nature,Attack,1,1,∞,medium,1,[Arc],,,,,
  127,Piece of Ice,Nature,Attack,0,2,1,medium,1,Add: Freezes target's skill buttons for 10 sec.,,,,,
  128,Piece of Thunder,Nature,Attack,0,2,1,medium,1,Add: Erases 1 defensive skill from target's equipped skills.,,,,,
  129,Piece of Fire,Nature,Attack,0,3,1,medium,1,,,,,,
  130,Bullet of Fire,Nature,Attack,2,2,∞,medium,1,,Yes,3,3,3,
  131,Blazing Bullet,Nature,Attack,2,3,∞,medium,1,Requires: Health 15 or higher,,,,,
  132,Scar of Battles,Nature,Attack,2,X,1,medium,3,STR = number of consumed attack skills.,,,,,
  133,Ice Lance,Nature,Attack,2,2,∞,medium,3,Add: Freezes target's skill buttons for 10 sec. Penalty: Aura cost +1 per use.,,,,,
  134,Storm Blade,Nature,Attack,5,2,∞,medium,5,Add: Erases 1 equipped attack skill from target. Penalty: Aura cost +1 per use.,,,,,
  135,Lightning Blade,Nature,Attack,5,3,∞,medium,1,Add: Erases 1 equipped defensive skill from target. Penalty: Aura cost +1 per use.,,,,,
  136,Memory of Battle,Nature,Attack,5,X,∞,medium,5,STR = number of consumed attack skills.,,,,,
  137,Crystallization,Nature,Attack,5,X,∞,medium,1,STR = STR of all your equipped Piece skills.,,,,,
  138,Root of Tree,Nature,Attack,2,6,1,long,1,[Crawl] Add: Pierce effect,,,,,
  139,Fang of Tree,Nature,Attack,3,8,1,long,4,[Crawl] Add: Pierce effect,,,,,
  140,Twister,Nature,Attack,4,4,∞,medium,2,[Move],,,,,
  141,Whirlwind,Nature,Attack,7,7,∞,medium,5,[Move],,,,,
  142,Lightning Bolt,Nature,Attack,1,4,1,medium,1,[Rain] Add: Erases 1 equipped defensive skill from target.,No,,,,
  143,Ice Storm,Nature,Attack,2,4,1,medium,4,[Rain] Add: Freezes target's skill button for 10 sec.,No,,,,
  144,Fire Storm,Nature,Attack,3,3,∞,medium,2,[Rain],No,,,,
  145,Thunder Storm,Nature,Attack,3,5,1,medium,2,[Rain] Add: Erases all equipped defensive skills from target.,No,,,,
  146,Blazing Storm,Nature,Attack,3,5,∞,medium,4,[Rain] Requires: Health 15 or higher,No,,,,
  147,Tremor,Nature,Attack,3,3,1,all,2,[Hole],No,,,,
  148,Massive Quake,Nature,Attack,6,6,1,all,5,[Hole],No,,,,
  149,Glacial Wall,Nature,Defense,2,3,∞,self,2,[Barrier] Add: Freezes target's skill button for 10 sec.,No,N/A,N/A,3,
  150,Wall of Current,Nature,Defense,2,4,∞,self,4,[Barrier] Add: Erases any short-range attack it blocks.,No,N/A,N/A,3,
  151,Wall of Fire,Nature,Defense,2,6,∞,self,2,[Barrier],No,N/A,N/A,3,
  152,Cyclone,Nature,Defense,3,8,1,self,2,[Barrier] Add: Erases any attack skill it blocks.,No,N/A,N/A,3,
  153,Vacuum Wall,Nature,Defense,6,4,∞,self,3,[Barrier] Add: Erases any attack skill it blocks.,No,N/A,N/A,3,
  154,Guard of Water,Nature,Defense,2,5,1,self,5,[Shelter] Automatically projects when attacked. Add: Erases any short-range attack skill it blocks.,No,N/A,N/A,5,
  155,Fortress of Iron,Nature,Defense,4,7,∞,self,1,[Shelter] Add: Erases any short-range attack skill it blocks.,No,N/A,N/A,3,
  156,Gust,Nature,Defense,2,-,∞,self,3,[Course],No,N/A,N/A,3,
  157,Wind Pressure,Nature,Erase,3,-,1,medium,2,Erases all of target's equipped non-attack and non-defensive skills.,No,,,,
  158,Abyss,Nature,Erase,0,-,1,capsule,1,Erases capsule you are touching.,No,,,,
  159,Starting Point,Nature,Erase,1,-,1,all,5,Erases Environmental crystals from battlefield.,No,,,,
  160,Return to Nature,Nature,Erase,3,-,1,all,3,Cancels Environmental effects and resets everyone's status and attributes to their initial state.,No,,,,
  161,Turbulence,Nature,Erase,5,-,1,all,1,Erases everyone's equipped non-attack and non-defensive skills.,No,,,,
  162,Purify,Nature,Erase,3,-,∞,all,4,Resets everyone's status and attributes to their initial state.,No,,,,
  163,Desertification,Nature,Environment,2,-,1,env,4,Slows everyone's Aura recovery speed by 30%.,No,N/A,N/A,4,
  164,Nature Blessing,Nature,Environment,2,-,1,env,4,Everyone gains +1 Health for each Aura Particle they capture.,No,N/A,N/A,4,
  165,Forest Sanctuary,Nature,Environment,2,-,1,env,1,Prohibits use of attack skills that deal >3 damage or STR = X.,No,N/A,N/A,4,
  166,Dense Fog,Nature,Environment,3,-,1,env,2,Reduces everyone's homing accuracy by 30%,No,N/A,N/A,4,
  167,Berserk,Nature,Environment,3,-,1,env,5,All attack skills gain Pierce effect.,No,N/A,N/A,4,
  168,Commandments,Nature,Environment,4,-,1,env,2,Prevents everyone from using Erase skills for 1 min.,No,N/A,N/A,4,
  169,Providence,Nature,Environment,5,-,1,env,5,Prevents everyone from using Psycho skills for 1 min.,No,N/A,N/A,4,
  170,Frostbite,Nature,Status,6,-,1,short,5,Prevents target from using skill assigned to the same button.,No,,,,
  171,Friendship,Nature,Status,2,-,1,medium,3,Incrases by 1 damage delt by target,,,,,
  172,Decoy,Nature,Status,2,-,∞,medium,3,Target can only lock on to you for 15 sec.,,,,,
  173,Entangle,Nature,Status,5,-,∞,medium,2,[Crawl] Prevents target from moving or using skills for 3 sec.,,,,,
  174,Curse of Earth,Nature,Status,4,-,1,medium,3,[Crawl] Reduces damage of target's attack by 1.,,,,,
  175,Heat,Nature,Status,4,-,1,self,3,Increases damage of your attacks by 1. Decreases your Aura recovery speed by 10%,No,,,,
  176,Stimulate,Nature,Status,7,-,1,self,5,Increases damage of your attacks by 2. Decreases your Aura recovery speed by 30%.,No,,,,
  177,Blessed Water,Nature,Special,3,-,1,medium,1,Target gains 5 Health.,No,,,,
  178,Graceful Woods,Nature,Special,1,-,1,self,2,Restores Aura to maximum.,No,,,,
  179,Healing Water,Nature,Special,4,-,1,self,1,Restores 5 Health.,No,,,,
  180,Orb,Nature,Special,2,-,∞,self,4,Automatically negates any Erase skill used. Can't by erased or overwritten.,Yes,N/A,N/A,1,You must NOT of been the caster of the erase skill
  181,Empty Hand,Ki,Attack,1,2,1,short,1,Add: Auto-Capture effect,No,,,,
  182,Swift Kick,Ki,Attack,1,4,1,short,2,Requires: Level 2 or lower,No,,,,
  183,Leg Throw,Ki,Attack,2,0,∞,short,4,Knocks down target.,No,,,,
  184,Tiger Kick,Ki,Attack,2,1,1,short,5,Add: Erases 1 equipped attack skill from target.,No,,,,
  185,High-speed Punch,Ki,Attack,2,1,∞,short,4,,No,N/A,N/A,5,Can hit 5 times before taget knockdown
  186,Hyperkick,Ki,Attack,2,2,∞,short,2,,No,,,,
  187,Dragon Punch,Ki,Attack,2,3,1,short,1,Add: Erases 1 equipped defensive skill from target.,No,,,,
  188,Hyperpunch,Ki,Attack,2,3,1,short,2,Add: Auto-Capture effect,No,,,,
  189,Swift Punch,Ki,Attack,2,4,∞,short,3,Requires: Level 2 or lower,No,,,,
  190,Splashdown,Ki,Attack,2,5,1,short,3,,No,,,,
  191,Swift Blow,Ki,Attack,2,7,1,short,1,Requires: Level 2 or lower,No,,,,
  192,Dance of Death,Ki,Attack,5,X,∞,short,4,STR = STR of all equipped short-ranged Ki attack.,No,N/A,N/A,3,
  193,Aura Leak,Ki,Attack,2,X,∞,short,5,STR = 50% of target's Aura.,No,,,,
  194,Aura Backflow,Ki,Attack,4,X,∞,short,4,STR = target's Aura.,No,,,,
  195,Ki Palm,Ki,Attack,X,X,∞,short,5,STR = Aura spent on this skill. Hold button to charge.,No,,,,
  196,Sky Pursuit,Ki,Attack,0,3,1,short,3,Requires: Knocked down target. Add: Auto-Capture effect.,No,,,,
  197,Pursuit,Ki,Attack,3,3,∞,short,1,Requires: Knocked down target,No,,,,
  198,Snap,Ki,Attack,2,0,∞,medium,1,Knocks down target.,,,,,
  199,Ki Lance,Ki,Attack,2,5,1,medium,3,Add: Pierce effect,,,,,
  200,Ki Bullet,Ki,Attack,3,1,∞,medium,2,Knocks down target.,,,,,
  201,Heat from Void,Ki,Attack,3,X,∞,medium,5,STR = double target's unassigned skill buttons.,,,,,
  202,Hyper Ki Lance,Ki,Attack,4,7,1,medium,4,Add: Pierce effect,,,,,
  203,Hyper Ki Bullet,Ki,Attack,5,3,∞,medium,1,Knocks down target.,,,,,
  204,Ki Cannon,Ki,Attack,X,X,∞,medium,4,STR = Aura spent on this skill. Hold button to charge.,No,4,2,3,
  205,Copy,Ki,Attack,0,X,1,-,1,Duplicates last attack skill that inflicted damage on you.,,,,,Is not restricted by requirments of copied skill
  206,Recollection,Ki,Attack,2,X,1,-,2,Duplicates last attack skill you used.,,,,,Is not restricted by requirments of copied skill
  207,Iron Skin,Ki,Defense,1,3,∞,self,1,[Shelter] Add: Erases any short-range attack skill it blocks.,No,N/A,N/A,3,
  208,Mind's Eye,Ki,Defense,2,5,1,self,3,[Shelter] Automatically projects when attacked.,No,N/A,N/A,5,
  209,Block,Ki,Defense,0,2,∞,self,1,[Brush],No,N/A,N/A,3,
  210,Protect,Ki,Defense,1,4,∞,self,2,[Brush],No,N/A,N/A,3,
  211,Guard,Ki,Defense,2,6,∞,self,3,[Brush],No,N/A,N/A,3,
  212,Absorb Energy,Ki,Defense,2,4,∞,self,1,[Absorb] Add: Aura increase = Aura cost of attack skill blocked.,No,N/A,N/A,3,
  213,Learning,Ki,Defense,3,6,1,self,2,[Absorb] Add: Captures attack skill it blocks.,No,N/A,N/A,3,
  214,Digestion,Ki,Defense,3,2,∞,self,3,[Absorb] Add: Health increase = damaged blocked.,No,N/A,N/A,3,
  215,Disrupt,Ki,Erase,3,-,1,short,4,Erases all of target's equipped attack skills.,No,,,,
  216,Tiger Slayer,Ki,Erase,2,-,1,medium,3,Erases 1 of target's equipped attack skills.,,,,,
  217,Dragon Slayer,Ki,Erase,2,-,1,medium,4,Erases 1 of target's equipped defensive skills. Penetrates defensive skills.,,,,,
  218,Giant Slayer,Ki,Erase,3,-,1,medium,1,Erases target's equipped skill with highest Aura cost.,,,,,
  219,Neutralization,Ki,Erase,1,-,∞,medium,3,Resets target's status and attributes to their initial state.,,,,,
  220,Steal Power,Ki,Erase,3,-,1,medium,2,Absorbs all target's Aura.,No,,,,
  221,Lack,Ki,Erase,4,-,1,medium,5,Erases all of target's equipped unlimited-use skills.,,,,,
  222,Exhaust,Ki,Erase,4,-,1,medium,1,Reduces target's Level by 50%.,,,,,
  223,Refresh,Ki,Erase,0,-,∞,self,2,Resets your status and attributes to their initial state.,No,,,,
  224,Fatigue,Ki,Environment,2,-,1,env,1,Everyone's Aura recovery ceases while moving.,No,N/A,N/A,4,
  225,Irregular Rhythm,Ki,Environment,3,-,1,env,1,Doubles Aura cost for all skills.,No,N/A,N/A,4,
  226,Memory Lapse,Ki,Environment,3,-,1,env,1,All skills become single-use.,No,N/A,N/A,4,
  227,Soul Cage,Ki,Environment,4,-,1,env,4,Everyone loses 1 Health for each capsule they capture.,No,N/A,N/A,4,
  228,Chaos,Ki,Environment,4,-,1,env,3,Prohibits skills with Aura cost of 2 or lower (or X).,No,N/A,N/A,4,
  229,Stagnant Air,Ki,Environment,5,-,1,env,4,Prevents everyone from using Nature skills for 1 min.,No,N/A,N/A,4,
  230,Pin Down,Ki,Status,6,-,∞,medium,5,[Hole] Prevents target from moving or using skills for 3 sec.,No,,,,
  231,Mind Reading,Ki,Status,2,-,1,self,3,Listen in on target team's conversation.,No,N/A,N/A,N/A,"No Target Required, Only effects caster"
  232,Tiger's Strength,Ki,Status,2,-,∞,self,1,Increases damage of your attacks by 2 for 15 sec.,No,,,,
  233,Lightning Speed,Ki,Status,2,-,∞,self,3,Increases your movement speed by 50% for 15 sec.,No,,,,
  234,Meditation,Ki,Status,4,-,1,self,2,Increases Aura recovery speed by 20%.,No,,,,
  235,Void,Ki,Status,4,-,1,self,1,Immunity to attack damage for 15 sec.,,,,,
  236,Trigger,Ki,Special,4,-,∞,medium,1,Forces target to use equipped skill assigned to same button.,No,4,4,3,
  237,Change the World,Ki,Erase,6,-,1,capsule,3,Respawns new capsules for everyone.,No,N/A,N/A,3,
  238,Regenerate,Ki,Special,6,-,1,self,5,Regenerates Health while immobile.,No,N/A,N/A,3,
  239,Jump,Ki,Special,1,-,5,self,2,Jump 30 ft.,No,N/A,N/A,2,
  240,Dash,Ki,Special,2,-,∞,self,2,Dash 30 ft.,No,N/A,N/A,3,
  241,Dhampir Claw,Faith,Attack,4,1,∞,short,2,Add: Health increase = damage dealt.,No,,,,
  242,Dhampir Fang,Faith,Attack,6,2,∞,short,1,Add: Health increase = damage dealt.,No,,,,
  243,Song of Succubus,Faith,Attack,3,2,1,short,4,Add: Level increase = damage dealt. Target's Level decreases by same number.,No,,,,
  244,Succubus Tempt,Faith,Attack,6,3,1,short,5,Add: Level increase = damage dealt. Target's Level decreases by same number.,No,,,,
  245,Muramasa Blade,Faith,Attack,6,10,1,short,5,Penalty: 2 Health,No,,,,
  246,Lingering Flame,Faith,Attack,0,1,∞,medium,2,Requires: Health 7 or lower,Yes,2,5,5,
  247,Scream of Evil,Faith,Attack,0,1,∞,medium,3,Penetrates obstacles. Penalty: 2 Health,,,,,
  248,Greedy Spirit,Faith,Attack,0,2,1,medium,3,Add: Reduces target's Aura to 0.,,,,,
  249,Agonies of Death,Faith,Attack,0,6,1,medium,2,Penetrates obstacles. Requires: Health 7 or lower.,,,,,
  250,Seal of Death,Faith,Attack,2,2,∞,medium,1,Can't be erased or overwritten. Penalty: 1 Health.,Yes,2,5,4,
  251,Demon's Fire,Faith,Attack,2,3,∞,medium,2,Penalty: 1 Health,,,,,
  252,Reincarnation,Faith,Attack,2,3,1,medium,2,Add: Retain if you have enough Aura to use again.,,,,,
  253,Hell's Fire,Faith,Attack,2,4,∞,medium,1,Penalty: 2 Health,,,,,
  254,Vampire Bat,Faith,Attack,3,3,1,medium,3,Add: Health increase = damage dealt.,Yes,2,4,3,
  255,Swarm of Moths,Faith,Attack,3,5,1,medium,1,"Add: For 10 sec, target's button presses cause 1 damage.",,,,,
  256,Fire of Gehenna,Faith,Attack,4,6,∞,medium,4,Penalty: 2 Health,Yes,3,4,3,
  257,Judge of Anubis,Faith,Attack,8,X,∞,medium,2,STR = (target's Health - yours) x 2. Effective when target's Health > yours. Penalty: 3 Health.,Yes,3,3,2,
  258,Venom Fang,Faith,Attack,3,2,∞,long,2,"Add: For 10 sec, target's button presses cause 1 damage.",,,,,
  259,Crawlers,Faith,Attack,5,5,∞,long,3,[Crawl],,,,,
  260,Spore Schism,Faith,Attack,5,8,1,medium,5,[Crawl] Explodes upon contact with target or any object.,,,,,
  261,Thor's Hammer,Faith,Attack,3,4,1,medium,1,[Fall] Penetrates obstacles.,No,3,5,3,
  262,Arrow of Artemis,Faith,Attack,3,6,1,medium,4,[Fall] Add: Retain if you have enough Aura to use again. Requires: Health 7 or lower.,,,,,
  263,Demon's Venom,Faith,Attack,4,2,∞,medium,3,"[Fall] Add: For 10 sec, target's button presses cause 1 damage.",,,,,
  264,Sign of Saints,Faith,Attack,4,X,∞,medium,3,[Fall] STR = double your unassigned skill buttons. Can't be erased or overwritten.,No,3,4,3,
  265,Lucifer's Arrow,Faith,Attack,2,3,∞,medium,5,[Rain] Penetrates obstacles. Requires: Health 7 or lower.,No,,,,
  266,Binding Needle,Faith,Attack,2,X,∞,medium,3,[Rain] STR = double target's unassigned skill buttons.,No,,,,
  267,Celestial Ship,Faith,Attack,5,10,1,medium,3,[Rain] Penalty: 2 Health,No,,,,
  268,Shield of Ruin,Faith,Defense,0,6,∞,self,1,[Barrier] Penalty: 2 Health,No,N/A,N/A,3,
  269,Shield of Aegis,Faith,Defense,2,5,∞,self,1,[Barrier],No,N/A,N/A,3,
  270,Guardian Angel,Faith,Defense,0,5,∞,self,2,[Shelter] Automatically projects when attacked. Penalty: 2 Health.,No,N/A,N/A,5,
  271,Protect Circle,Faith,Defense,2,4,∞,self,2,[Shelter],No,N/A,N/A,3,
  272,Devil's Arm,Faith,Defense,0,4,∞,self,2,[Brush] Add: Erases any short-range attack skill it blocks. Penalty: 1 Health.,No,N/A,N/A,3,
  273,Angel's Wing,Faith,Defense,2,4,∞,self,3,[Brush] Add: Erases any short-range attack skill it blocks.,No,N/A,N/A,3,
  274,Flash Hole,Faith,Defense,3,3,∞,self,5,[Absorb] Add: Erases any attack skill it blocks.,No,N/A,N/A,3,
  275,Dark Hole,Faith,Defense,2,4,∞,self,4,[Absorb] Add: Erases any attack skill it blocks. Penalty: 1 Health.,No,N/A,N/A,3,
  276,Bloody Ritual,Faith,Erase,2,-,∞,medium,2,Reduces target's Level by 50%. Penalty: 3 Health.,No,3,5,3,
  277,Hungry Demon,Faith,Erase,4,-,∞,medium,2,Erases target's equipped skill assigned to same button. Penalty: 1 Health.,No,,,,
  278,Thieving Imp,Faith,Erase,2,-,1,capsule,2,Captures capsule you are touching.,No,,,,
  279,Diabolical Trick,Faith,Erase,5,-,∞,capsule,5,Erases capsule you are touching.,No,,,,
  280,Vicious Balance,Faith,Erase,2,-,1,all,4,Everyone's Level decreases to player's lowest Level. Penalty: 2 Health,No,,,,
  281,Fairy Ring,Faith,Erase,2,-,∞,all,1,Reduces everyone's Aura to 0. Penalty: 1 Health.,No,,,,
  282,Judgment,Faith,Erase,0,-,∞,all,5,Erases Environmental crystals from battlefield. Penalty: 1 Health,No,,,,
  283,Calamity,Faith,Erase,6,-,1,all,5,[Hole] Erases everyone's equipped skills.,No,,,,
  284,Violent Change,Faith,Erase,6,-,1,capsule,1,Erases all capsules from battlefield.,No,,,,
  285,Angel Tears,Faith,Erase,1,-,1,self,5,Resets your status and attributes to their initial state. Add: 1 Level.,No,,,,
  286,Lunar Force,Faith,Environment,2,-,1,env,2,Increases damage of everyone's attack by 1.,No,N/A,N/A,4,
  287,Necronomicon,Faith,Environment,4,-,1,env,5,"Everyone's attack skills lose all bonuses, restrictions, and penalties.",No,N/A,N/A,4,Removes all bonuses from everyones attacks
  288,Athena's Command,Faith,Environment,4,-,1,env,2,Prohibits use of attack skills that deal <3 damage or STR = x.,No,N/A,N/A,4,
  289,Spiritual World,Faith,Environment,5,-,1,env,5,Prevents everyone from using Ki skills for 1 min.,No,N/A,N/A,4,
  290,Trance,Faith,Status,0,-,∞,self,2,Increases damage of your attacks by 2 for 15 sec. Penalty: 1 Health.,No,,,,
  291,Doppelganger,Faith,Status,4,-,1,self,3,Sets your attributes to match target's.,No,N/A,N/A,3,Instantly takes on +'s and -'s of current target
  292,Demon's Wing,Faith,Status,5,-,1,self,5,Levitate 7 ft in air for 15 sec. Add: Invisibility; no one can lock onto you for 15 sec.,No,,,,
  293,Angel's Breath,Faith,Special,1,-,∞,short,4,Reverses target's attributes (Speed +2 becomes Speed -2).,No,,,,
  294,Fusion,Faith,Special,3,-,∞,short,5,Your Health and target's are averaged.,No,N/A,N/A,3,
  295,Annoying Gift,Faith,Special,3,-,∞,short,3,Forces target to capture your equipped skills.,No,,,,
  296,Armaros,Faith,Special,3,-,1,all,2,Reverses everyone's attributes (Speed +2 becomes Speed -2).,No,,,,
  297,Rebirth,Faith,Special,0,-,1,self,2,Restores 10 Health. Penalty: Reduces level to 0.,No,,,,
  298,Invulnerability,Faith,Special,4,-,∞,self,4,Immune to damage while immobile.,No,,,,
  299,Amulet,Faith,Special,1,-,3,self,2,Automatically reverses effects of last Erase skill that hit you.,No,N/A,N/A,3,You must NOT of been the caster of the erase skill
  300,Mephisto's Pact,Faith,Special,0,-,1,self,3,Immediately captures an unconsumed skill from your arsenal. Penalty: 3 Health.,,,,,
  301,Delay Bomb,Psycho,Attack,3,3,∞,medium,5+,[Parabola] Explodes on impact.,,,,,
  302,Mini-Meteor,Psycho,Attack,4,3,∞,medium,5+,[Fall],,,,,
  303,Antigravity Trap,Psycho,Status,5,-,1,mine,5+,Detonates when target enters blast area. Levitates target 10ft in the air for 3 sec.,No,,,,
  304,Charge,Psycho,Special,5,-,∞,self,5+,Teleports you to target's start point.,No,N/A,N/A,4,
  305,Aura Cannon,Optical,Attack,6,6,∞,long,5+,Requires: Maximum Aura,No,3,4,3,
  306,Throttle Blaster,Optical,Attack,3,3,∞,medium,5+,,,,,,
  307,Boost Mine,Optical,Special,3,-,1,mine,5+,Increases your level by 2,No,,,,
  308,Quantum Amp,Optical,Special,3,-,1,all,5+,Gives everyone 2 levels,No,,,,
  309,Piece of Wind,Nature,Attack,0,1,1,medium,5+,[Arc] Add: Erase 1 equipped attack skill from target,,,,,
  310,Throttle Fireball,Nature,Attack,1,1,∞,medium,5+,,,,,,
  311,Tornado,Nature,Attack,4,4,∞,medium,5+,[Move],No,2,1,3,Slower than Twister
  312,Earthquake,Nature,Attack,5,3,∞,all,5+,[Hole],No,,,,
  313,Vacuum Palm,Ki,Attack,4,X,∞,short,5+,STR = double target's unassigned skill buttons.,No,,,,
  314,Backdraft Bullet,Ki,Attack,3,3,∞,medium,5+,Requires: effective only against knocked down targets.,,,,,
  315,Lost Dragon,Ki,Erase,3,-,1,medium,5+,Erase all of target's equipped defense skills,,,,,
  316,Disremember,Ki,Erase,8,-,∞,medium,5+,Erases target's equipped lowest cost Aura skill,,,,,
  317,True Muramasa,Faith,Attack,6,6,∞,short,5+,Lose one life,No,,,,
  318,Will-o'-the-Wisp,Faith,Attack,3,3,∞,medium,5+,,Yes,1,4,4,
  319,Jackpot,Faith,Attack,4,X,∞,all,5+,"[Hole] STR randomly 0, 3, or 6",No,,,,
  320,Joke of Anubis,Faith,Attack,4,X,∞,medium,5+,STR = your Health - target's. Effective when your Health > target's. Penalty: 2 Health,Yes,3,5,3,
  321,Excaliber,Psycho,Attack,4,X,∞,short,5+,"STR randomly 0, 3, or 6",No,,,,
  322,Knife Grind,Psycho,Attack,2,2,3,short,5+,Aura cost -1 per use,No,,,,
  323,Fast Bomb,Psycho,Attack,2,2,∞,mine,5+,Sets then detonates.,No,N/A,N/A,3,Use +SPD or Dash to avoid hurting yourself
  324,Shield Breaker,Psycho,Erase,3,-,1,short,5+,Pierces through defenses.,No,N/A,N/A,3,
  325,Fast Wave,Optical,Attack,1,4,1,mine,5+,Explodes around self.,No,,,,
  326,Twist Laser,Optical,Attack,2,2,∞,long,5+,[Arc],,,,,
  327,Erase Shell,Optical,Defense,6,2,∞,self,5+,[Shetler] Add: Erases any attack skill it blocks,No,N/A,N/A,3,
  328,Level Baton,Optical,Special,0,-,∞,short,5+,Increases target's Level by 1. Penalty: 1 Level.,No,,,,
  329,Arc of Fire,Nature,Attack,2,2,∞,medium,5+,[Arc],Yes,3,3,3,
  330,Chill Breeze,Nature,Status,4,-,1,all,5+,Freezes everyone's skill buttons for 10 seconds.,No,,,,
  331,Blessed Rain,Nature,Special,3,-,1,all,5+,Everyone gains +5 health,No,,,,
  332,Unison,Nature,Environment,2,-,1,all,5+,,No,N/A,N/A,4,Does not display text like other ENV skills.
  333,Crawling Bullet,Ki,Attack,3,1,∞,medium,5+,[Crawl] Knocks down target,No,5,3,3,
  334,Dragon Bullet,Ki,Attack,3,2,∞,medium,5+,,No,2,3,2,
  335,Ethos Inspiration,Ki,Status,2,0,1,medium,5+,Increases target's aura recovery speed by 20%,No,5,4,3,
  336,Vacuum Bullet,Ki,Special,3,-,∞,medium,5+,Penetrates defensive skills.,Yes,4,4,3,No real use for this skill has been found
  337,Dance of Moths,Faith,Attack,3,5,1,medium,5+,"Add: For 10 sec, target's button presses cause 1 damage.",Yes,3,4,4,
  338,Illusion of Death,Faith,Attack,4,5,1,medium,5+,Penetrates defense skills. Penalty: 2 Health,,,,,
  339,Judge of Ares,Faith,Erase,6,-,1,all,5+,Erases everyone's equiped defensive skill. Penalty: 3 Health,,,,,
  340,Armaros Watch,Faith,Special,5,-,∞,medium,5+,Reverses target's attributes (Speed +2 becomes Speed -2),No,5,4,3,
  341,Impact Burst,Psycho,Attack,3,6,1,long,5,Explodes on impact. Ricochets off objects.,,,,,
  342,Vast Mayhem,Psycho,Status,4,-,1,all,5,"For 15 sec, inverts everyone's directional controls.",,,,,
  343,Vapor Cloud,Psycho,Status,3,-,∞,mine,5,Press once to set. Detonates when anyone enters blast area. Freezes target?s skill buttons for 3 sec.,,,,,
  344,Freeze Shot,Psycho,Status,3,-,∞,medium,5,"For 10 sec, prevents target from using same button.",,,,,
  345,Mobilize,Psycho,Special,6,-,1,all,2,All players are teleported to your start point.,,,,,
  346,Teleportrap,Psycho,Special,3,-,3,mine,5,Press once to set. Detonates when anyone enters blast area. Teleports target to your start point.,,,,,
  347,EL Bomb,Optical,Attack,4,2,∞,medium,5,Penalty: 1 Level.,,,,,
  348,Giga Ruin,Optical,Attack,7,4,1,long,5,Penetrates obstacles.,,,,,
  349,Ground Laser,Optical,Attack,3,1,∞,long,5,[Crawl],,,,,
  350,Particle Mortar,Optical,Attack,4,2,∞,long,5,[Parabola] Penetrates obstacles.,,,,,
  351,Cooling,Optical,Erase,3,-,3,medium,3,[Parabola] Reduces target's Level by 1.,,,,,
  352,Still Moment,Optical,Status,6,-,1,all,5,"For 5 sec, everyone is immobilized. Penalty: 2 Levels.",,,,,
  353,Place of Invisibility,Optical,Status,4,-,1,all,4,"For 15 sec, no one can be locked onto.",,,,,
  354,Downcast,Optical,Special,1,-,∞,self,3,Penalty: 1 Level.,,,,,
  355,Life-Giving Sword,Nature,Attack,3,2,2,short,5,Add: Health increase = damage dealt.,,,,,
  356,Geyser Impact,Nature,Attack,3,4,1,medium,5,[Hole] Effective against downed opponents.,,,,,
  357,Rafflesia Fang,Nature,Defense,2,3,1,self,2,[Barrier] Add: Health increase = damage blocked. Anti-Pierce,,,,,
  358,Failing Wall,Nature,Defense,2,7,∞,self,2,[Barrier] Reduces defensive strength each time used.,,,,,
  359,Protecting Air,Nature,Defense,3,3,1,self,5,[Shelter] Automatically projects when attacked.,,,,,
  360,Heat Devil,Nature,Status,7,-,1,self,4,"For 5 sec, no one can lock onto you; speed of movement increased by 90%.",,,,,
  361,Poison Blur,Nature,Status,4,-,∞,mine,4,"Detonates when anyone enters blast area. For 10 sec, target's button presses cause 1 damage.",,,,,
  362,Pursuit Stopper,Ki,Attack,3,3,1,short,5,,,,,,
  363,Young White Dragon,Ki,Attack,X,X,∞,medium,5,[Crawl] STR = Aura spent on skill. Hold button to charge.,,,,,
  364,Tiger Prevails,Ki,Erase,7,-,1,short,5,Erases 1 of target's attack skills. Penetrates defensive skills.,,,,,
  365,Martial Arts Scroll,Ki,Status,4,-,1,self,3,"For 5 sec, increases damage of your attacks by 3 . Aura recovery speed is increased by 90%.",,,,,
  366,Play Dead,Ki,Special,5,-,3,self,5,"Health recovers while immobile . For 30 sec, movement speed is reduced by 50%.",,,,,
  367,Sword Slap,Ki,Special,3,-,∞,short,5+,Briefly stops target's movement,,,,,
  368,Wings of Hope,Faith,Attack,4,3,∞,medium,2,Requires: Health 3 or lower. Add: Health increase = damage dealt.,,,,,
  369,Arms of the Curse,Faith,Attack,3,2,3,short,5,"Add: For 10 sec, target's button presses cause 1 damage.",,,,,
  370,Dark Protection,Faith,Defense,2,3,5,self,5,[Shelter] Add: Protective power increases each time used.,,,,,
  371,Traveling Thought,Faith,Environment,3,-,1,env,2,"For 1 min, homing accuracy is increased by 50%.",,,,,
  372,Withering Curse,Faith,Status,2,-,1,mine,3,"Press once to set. Detonates when apporoached. For 10 sec, button presses cause 1 damage.",,,,,
  373,Venom Drip,Faith,Status,4,-,1,all,5,"For 15 sec, button presses cause 1 damage.",,,,,
  374,Phantom Dust,Faith,Special,99,-,1,all,1,???,,,,,`;

  const csv = parse(text).data.map(row => {
    return {
      id: parseInt(row[0], 10),
      name: row[1],
      school: row[2],
      schoolLower: row[2].toLowerCase(),
      type: row[3],
      typeLower: row[3].toLowerCase(),
      cost: row[4],
      str: row[5],
      use: row[6],
      distance: row[7],
      rarity: parseInt(row[8], 10),
      skillText: row[9],
      air: row[10] === 'Yes',
      velocity: row[11] === '' || row[11] === 'N/A' ? null : parseInt(row[11]),
      homing: row[12] === '<Note>' ? [1, 4] : (row[12] === '' || row[12] === 'N/A' ? [] : [parseInt(row[12])]),
      recovery:  row[13] === '' || row[13] === 'N/A' ? null : parseInt(row[13]),
      notes: row[14],
    }
  });

  return {
    props: {
      csv,
    }
  }
}