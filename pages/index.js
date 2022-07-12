import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useMemo, useState } from "react"
import Skill from '../components/skill/Skill'
import Fieldset from '../components/form/Fieldset'
import useSWR from 'swr'
import QueryString from 'qs'
import { getSkills } from '../lib/query'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home(props) {
  const { skills, allSchoolFilters, allTypeFilters, allDistanceFilters, allCosts, allStr } = props;

  const [filteredSkills, setFilteredSkills] = useState(skills);
  
  const [schoolFilters, setSchoolFilters] = useState(allSchoolFilters);
  const [typeFilters, setTypeFilters] = useState(allTypeFilters);
  const [distanceFilters, setDistanceFilters] = useState(allDistanceFilters);
  const [airOk, setAirOk] = useState(false);
  const [costFilters, setCostFilters] = useState([]);
  const [strFilters, setStrFilters] = useState([]);

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
          <Fieldset type="checkboxes" fieldsetName="School" filters={schoolFilters} onChange={schoolFilterChangeHandler} />
          <Fieldset type="checkboxes" fieldsetName="Type" filters={typeFilters} onChange={typeFilterChangeHandler} />
          <Fieldset type="checkboxes" fieldsetName="Distance" filters={distanceFilters} onChange={distanceFilterChangeHandler} />
          <Fieldset type="checkboxes" fieldsetName="Air" filters={[ {name: 'Performable in the air?', checked: airOk }]} onChange={airOkChangeHandler} />
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
  const allSchoolFilters = ['Psycho', 'Optical', 'Nature', 'Ki', 'Faith'].map(item => { return { name: item, checked: false } });
  const allTypeFilters = ['Attack', 'Defense', 'Erase', 'Environment', 'Status', 'Special'].map(item => { return { name: item, checked: false } });
  const allDistanceFilters = ['short', 'medium', 'long', 'all', 'self', 'auto', 'mine', 'capsule'].map(item => { return { name: item, checked: false } });
  const allCosts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 99, 'X'].sort();
  const allStr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 'X'].sort();

  return {
    props: {
      allSchoolFilters,
      allTypeFilters,
      allDistanceFilters,
      allCosts,
      allStr,
      skills,
    }
  }
}