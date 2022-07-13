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
  const [costFilters, setCostFilters] = useState(allCosts);
  const [strFilters, setStrFilters] = useState(allStr);

  const schoolFilter = useMemo(() => {
    return schoolFilters.filter(item => item.checked).map(item => item.name);
  }, [schoolFilters]);

  const typeFilter = useMemo(() => {
    return typeFilters.filter(item => item.checked).map(item => item.name)
  }, [typeFilters]);

  const distanceFilter = useMemo(() => {
    return distanceFilters.filter(item => item.checked).map(item => item.name)
  }, [distanceFilters]);

  const { value: costFilter, comp: costOpFilter } = costFilters;
  const { value: strFilter, comp: strOpFilter } = strFilters;

  const filters = useMemo(() => {
    return {
      school: schoolFilter,
      type: typeFilter,
      distance: distanceFilter,
      air: airOk,
      cost: costFilter,
      costOp: costOpFilter,
      str: strFilter,
      strOp: strOpFilter,
    }
  }, [schoolFilter, typeFilter, distanceFilter, airOk, costFilter, costOpFilter, strFilter, strOpFilter]);

  const swrKey = useMemo(() => {
    
    const buildParams = () => {
      let params = Object.entries(filters).reduce((a,[k,v]) => (v === '' || v === false || (Array.isArray(v) && v.length === 0) ? a : (a[k]=v, a)), {});

      if (params.cost === undefined) {
        delete params.costOp;
      }
      else if (params.cost === 'X' && params.costOp !== 'eq') {
        delete params.cost;
        delete params.costOp;
      }

      if (params.str === undefined) {
        delete params.strOp;
      }
      else if (params.str === 'X' && params.strOp !== 'eq') {
        delete params.str;
        delete params.strOp;
      }

      return params;
    }

    const searchParams = QueryString.stringify(buildParams());

    return `/api/skills${searchParams.toString !== '' ? `?${searchParams.toString()}` : ''}`;
  }, [filters]);

  const { data, error, isValidating } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const filterCheckboxChangeHandler = (index, items) => {
    return items.map((item, delta) => 
      index === delta ? { ...item, checked: !item.checked} : item
    ) 
  }

  const filterSelectChangeHandler = (value, comp, prev) => {
    return { ...prev, value, comp }
  }

  const schoolFilterChangeHandler = (index) => {
    setSchoolFilters(prev => filterCheckboxChangeHandler(index, prev));
  }

  const typeFilterChangeHandler = (index) => {
    setTypeFilters(prev => filterCheckboxChangeHandler(index, prev));
  }

  const distanceFilterChangeHandler = (index) => {
    setDistanceFilters(prev => filterCheckboxChangeHandler(index, prev));
  }

  const airOkChangeHandler = () => {
    setAirOk(prev => !prev);
  }

  const costFilterChangeHandler = (value, comp) => {
    setCostFilters(prev => filterSelectChangeHandler(value, comp, prev));
  }

  const strFilterChangeHandler = (value, comp) => {
    setStrFilters(prev => filterSelectChangeHandler(value, comp, prev));
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
          <Fieldset type="select" fieldsetName="Cost" filters={costFilters} onChange={costFilterChangeHandler} />
          <Fieldset type="select" fieldsetName="Str/Def" filters={strFilters} onChange={strFilterChangeHandler} />
        </form>

        <div className={`flex flex-wrap flex-col md:flex-row align-top gap-6 justify-center px-4 mt-8 w-full`}>
          {filteredSkills && filteredSkills.map(skill => <Skill key={skill.id} skill={skill} />)}
        </div>
      </main>

      <footer className='text-[#eee] text-center pb-8'>
        <p>Site created by <a className='underline hover:no-underline' href="mailto:jesmasterha@gmail.com">Jesmaster</a></p>
        <p><a rel="noreferrer" target="_blank" className='underline hover:no-underline' href="https://github.com/Jesmaster/pd-skills">https://github.com/Jesmaster/pd-skills</a></p>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const skills = await getSkills({});
  const allSchoolFilters = ['Psycho', 'Optical', 'Nature', 'Ki', 'Faith'].map(item => { return { name: item, checked: false } });
  const allTypeFilters = ['Attack', 'Defense', 'Erase', 'Environment', 'Status', 'Special'].map(item => { return { name: item, checked: false } });
  const allDistanceFilters = ['short', 'medium', 'long', 'all', 'self', 'auto', 'mine', 'capsule'].map(item => { return { name: item, checked: false } });
  const allCosts = { items: ['', 0, 1, 2, 3, 4, 5, 6, 7, 8, 99, 'X'], comp: 'eq', value: '' };
  const allStr = { items: ['', 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 'X'], comp: 'eq', value: '' };

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