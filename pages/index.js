import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useRef, useState } from "react"
import Skill from '../components/Skill'
import useSWR from 'swr'
import { getSkills } from '../lib/query'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home(props) {
  const { skills } = props;

  const [filteredSkills, setFilteredSkills] = useState(skills);
  const [filters, setFilters] = useState({
    school: '',
    type: '',
  });

  const swrKey = useMemo(() => {
    const searchParams = new URLSearchParams(
      Object.entries(filters).reduce((a,[k,v]) => (v === '' ? a : (a[k]=v, a)), {})
    );

    return `/api/skills${searchParams.toString !== '' ? `?${searchParams.toString()}` : ''}`;
  }, [filters]);

  const { data, error, isValidating } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const schoolSelectRef = useRef();

  const schoolFilterChangeHandler = () => {
    setFilters(prev => {
      return {...prev, school: schoolSelectRef.current.value}
    });
  }

  useEffect(() => {
    if (isValidating === false && data) {
      console.log('updating...');
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

        <form className='border-black border p-4 bg-white flex flex-wrap'>
          <div className={`flex flex-col gap-1`}>
            <label className='font-bold' htmlFor="school">School:</label>
            <select className={'py-2 px-4 rounded'} ref={schoolSelectRef} name="school" onChange={schoolFilterChangeHandler}>
              <option value="">- All -</option>
              <option value="Psycho">Psycho</option>
              <option value="Optical">Optical</option>
              <option value="Nature">Nature</option>
              <option value="Ki">Ki</option>
              <option value="Faith">Faith</option>
            </select>
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

  return {
    props: {
      skills,
    }
  }
}