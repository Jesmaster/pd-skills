import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from "react"
import Skill from '../components/skill/Skill'
import useSWR from 'swr'
import QueryString from 'qs'
import { getSkills } from '../lib/query'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home(props) {
  const { skills, allSchoolFilters, allTypeFilters, allDistanceFilters } = props;

  const [filteredSkills, setFilteredSkills] = useState(skills);
  
  const [schoolFilters, setSchoolFilters] = useState(allSchoolFilters);
  const [typeFilters, setTypeFilters] = useState(allTypeFilters);
  const [distanceFilters, setDistanceFilters] = useState(allDistanceFilters);
  const [airOk, setAirOk] = useState(false);

  const filters = useMemo(() => {
    return {
      school: schoolFilters.filter(item => item.checked).map(item => item.name),
      type: typeFilters.filter(item => item.checked).map(item => item.name),
      distance: distanceFilters.filter(item => item.checked).map(item => item.name),
      air: airOk,
    }
  }, [schoolFilters, typeFilters, distanceFilters, airOk]);

  const swrKey = useMemo(() => {
    const searchParams = QueryString.stringify(
      Object.entries(filters).reduce((a,[k,v]) => (v === '' || v === false || (Array.isArray(v) && v.length === 0) ? a : (a[k]=v, a)), {})
    );

    return `/api/skills${searchParams.toString !== '' ? `?${searchParams.toString()}` : ''}`;
  }, [filters]);

  const { data, error, isValidating } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const filterChangeHandler = (index, items) => {
    return items.map((item, delta) => 
      index === delta ? { ...item, checked: !item.checked} : item
    ) 
  }

  const schoolFilterChangeHandler = (index) => {
    setSchoolFilters(prev => filterChangeHandler(index, prev));
  }

  const typeFilterChangeHandler = (index) => {
    setTypeFilters(prev => filterChangeHandler(index, prev));
  }

  const distanceFilterChangeHandler = (index) => {
    setDistanceFilters(prev => filterChangeHandler(index, prev));
  }

  const airOkChangeHandler = () => {
    setAirOk(prev => !prev);
  }

  useEffect(() => {
    if (isValidating === false && data) {
      setFilteredSkills(data);
    }
  }, [data, isValidating]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Phantom Dust Skills</title>
        <meta name="description" content="Phantom Dust skill list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`min-h-screen py-16 flex flex-col items-center`}>
        <h1 className={`text-center font-bold text-[#eee] text-5xl md:text-7xl mb-16`}>
          Phantom Dust Skill List
        </h1>

        <form className='flex flex-col md:flex-row flex-wrap justify-center gap-4 p-4'>
          <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
              <legend className='font-bold mb-2'>School:</legend>
              {schoolFilters.map((item, index) => {
                const { name, checked } = item;

                return (
                  <div className='flex flex-wrap items-center gap-1' key={name}>
                    <input checked={checked} onChange={() => schoolFilterChangeHandler(index)} type="checkbox" name="school" value={name} id={name} />
                    <label htmlFor={name}>{name}</label>
                  </div>
                )
              })}
            </fieldset>
          </div>

          <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
              <legend className='font-bold mb-2'>Type:</legend>
              {typeFilters.map((item, index) => {
                const { name, checked } = item;

                return (
                  <div className='flex flex-wrap items-center gap-1' key={name}>
                    <input checked={checked} onChange={() => typeFilterChangeHandler(index)} type="checkbox" name="type" value={name} id={name} />
                    <label htmlFor={name}>{name}</label>
                  </div>
                )
              })}
            </fieldset>
          </div>

          <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
              <legend className='font-bold mb-2'>Distance:</legend>
              {distanceFilters.map((item, index) => {
                const { name, checked } = item;

                return (
                  <div className='flex flex-wrap items-center gap-1' key={name}>
                    <input checked={checked} onChange={() => distanceFilterChangeHandler(index)} type="checkbox" name="distance" value={name} id={name} />
                    <label htmlFor={name}>{name}</label>
                  </div>
                )
              })}
            </fieldset>
          </div>

          <div className='border-black border p-4 bg-white flex flex-wrap'>
            <fieldset className='flex flex-wrap gap-4'>
              <legend className='font-bold mb-2'>Air:</legend>
              <div className='flex flex-wrap items-center gap-1' key="air_ok">
                <input checked={airOk} onChange={airOkChangeHandler} type="checkbox" name="air_ok" value={airOk} id="air-ok" />
                <label htmlFor="air-ok">Perfomable in the air?</label>
              </div>
            </fieldset>
          </div>
        </form>

        <div className={`flex flex-wrap flex-col md:flex-row align-top gap-6 justify-center px-4 mt-8`}>
          {filteredSkills && filteredSkills.map(skill => <Skill key={skill.id} skill={skill} />)}
        </div>
      </main>

      <footer className='text-[#eee] text-center pb-8'>
        <p>Site created by <a className='underline hover:no-underline' href="mailto:jesmasterha@gmail.com">Jesmaster</a></p>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const skills = await getSkills({});
  const allSchoolFilters = ['Psycho', 'Optical', 'Nature', 'Ki', 'Faith'].map(item => { return { name: item, checked: false }} );
  const allTypeFilters = ['Attack', 'Defense', 'Erase', 'Environment', 'Status', 'Special'].map(item => { return { name: item, checked: false } });
  const allDistanceFilters = ['short', 'medium', 'long', 'all', 'self', 'auto', 'mine', 'capsule'].map(item => { return { name: item, checked: false } });

  return {
    props: {
      allSchoolFilters,
      allTypeFilters,
      allDistanceFilters,
      skills,
    }
  }
}