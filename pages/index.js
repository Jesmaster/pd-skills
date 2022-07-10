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

      <main className={styles.main}>
        <h1 className={styles.title}>
         Phantom Dust Skill List
        </h1>

        <form>
          <div className={styles['form-input-wrapper']}>
            <label htmlFor="school">School:</label>
            <select ref={schoolSelectRef} name="school" onChange={schoolFilterChangeHandler}>
              <option value="">- All -</option>
              <option value="Psycho">Psycho</option>
              <option value="Optical">Optical</option>
              <option value="Nature">Nature</option>
              <option value="Ki">Ki</option>
              <option value="Faith">Faith</option>
            </select>
          </div>
        </form>

        <div className={styles.grid}>
          {filteredSkills && filteredSkills.map(skill => <Skill key={skill.id} skill={skill} />)}
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
  const skills = await getSkills({});

  return {
    props: {
      skills,
    }
  }
}