import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useMemo, useState, useTransition } from "react";
import Skill from "../components/skill/Skill";
import Fieldset from "../components/form/Fieldset";
import useSWR from "swr";
import QueryString from "qs";
import { getSkills } from "../lib/query";
import { useRouter } from "next/router";
import { FaCopy } from "react-icons/fa";

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

const localAvailable = storageAvailable("localStorage");
const localVersion = "1";

const fetcher = async (url) => {
  if (localAvailable && localStorage.getItem("version") !== localVersion) {
    localStorage.clear();
    localStorage.setItem("version", localVersion);
  }

  if (localAvailable && localStorage.getItem(url)) {
    return JSON.parse(localStorage.getItem(url));
  } else {
    const res = await fetch(url);
    const result = await res.json();

    if (localAvailable) {
      localStorage.setItem(url, JSON.stringify(result));
    }

    return result;
  }
};

export default function Home(props) {
  const {
    skills,
    allSchoolFilters,
    allTypeFilters,
    allDistanceFilters,
    allCosts,
    allStr,
    allKeywords,
    allVelocity,
    allHoming,
    allRecovery,
    allUse,
    allFilteredSkills,
  } = props;

  const [filteredSkills, setFilteredSkills] = useState(
    new Set(allFilteredSkills),
  );

  const [schoolFilters, setSchoolFilters] = useState(allSchoolFilters);
  const [typeFilters, setTypeFilters] = useState(allTypeFilters);
  const [distanceFilters, setDistanceFilters] = useState(allDistanceFilters);
  const [airOk, setAirOk] = useState(false);
  const [costFilters, setCostFilters] = useState(allCosts);
  const [strFilters, setStrFilters] = useState(allStr);
  const [keywordFilters, setKeywordFilters] = useState(allKeywords);
  const [velocityFilters, setVelocityFilters] = useState(allVelocity);
  const [homingFilters, setHomingFilters] = useState(allHoming);
  const [recoveryFilters, setRecoveryFilters] = useState(allRecovery);
  const [useFilters, setUseFilters] = useState(allUse);
  const [resetting, setResetting] = useState(false);
  const [displaySkills, setDisplaySkills] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { query, isReady } = useRouter();
  const { filters: queryFilters } = query;

  const schoolFilter = useMemo(() => {
    return schoolFilters
      .filter((item) => item.checked)
      .map((item) => item.name);
  }, [schoolFilters]);

  const typeFilter = useMemo(() => {
    return typeFilters.filter((item) => item.checked).map((item) => item.name);
  }, [typeFilters]);

  const distanceFilter = useMemo(() => {
    return distanceFilters
      .filter((item) => item.checked)
      .map((item) => item.name);
  }, [distanceFilters]);

  const keywordFilter = useMemo(() => {
    return keywordFilters
      .filter((item) => item.checked)
      .map((item) => item.name);
  }, [keywordFilters]);

  const { value: costFilter, comp: costOpFilter } = costFilters;
  const { value: strFilter, comp: strOpFilter } = strFilters;
  const { value: velocityFilter, comp: velocityOpFilter } = velocityFilters;
  const { value: homingFilter, comp: homingOpFilter } = homingFilters;
  const { value: recoveryFilter, comp: recoveryOpFilter } = recoveryFilters;
  const { value: useFilter, comp: useOpFilter } = useFilters;

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
      keyword: keywordFilter,
      velocity: velocityFilter,
      velocityOp: velocityOpFilter,
      homing: homingFilter,
      homingOp: homingOpFilter,
      recovery: recoveryFilter,
      recoveryOp: recoveryOpFilter,
      use: useFilter,
      useOp: useOpFilter,
    };
  }, [
    schoolFilter,
    typeFilter,
    distanceFilter,
    airOk,
    costFilter,
    costOpFilter,
    strFilter,
    strOpFilter,
    keywordFilter,
    velocityFilter,
    velocityOpFilter,
    homingFilter,
    homingOpFilter,
    recoveryFilter,
    recoveryOpFilter,
    useFilter,
    useOpFilter,
  ]);

  const buildParams = useMemo(() => {
    let params = Object.entries(filters).reduce(
      (a, [k, v]) =>
        v === "" || v === false || (Array.isArray(v) && v.length === 0)
          ? a
          : ((a[k] = v), a),
      {},
    );

    if (params.cost === undefined) {
      delete params.costOp;
    } else if (params.cost === "X" && params.costOp !== "eq") {
      params.costOp = "eq";
    }

    if (params.str === undefined) {
      delete params.strOp;
    } else if (params.str === "X" && params.strOp !== "eq") {
      params.strOp = "eq";
    }

    if (params.use === undefined) {
      delete params.useOp;
    } else if (params.use === "inf" && params.useOp !== "eq") {
      params.useOp = "eq";
    }

    if (params.velocity === undefined) {
      delete params.velocityOp;
    }

    if (params.homing === undefined) {
      delete params.homingOp;
    }

    if (params.recovery === undefined) {
      delete params.recoveryOp;
    }

    return params;
  }, [filters]);

  const swrKey = useMemo(() => {
    const searchParams = QueryString.stringify(buildParams);

    return `/api/skills${
      searchParams.toString() !== "" ? `?${searchParams.toString()}` : ""
    }`;
  }, [buildParams]);

  const { data, isValidating } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
  });

  const noFilters =
    skills.length === filteredSkills.size || swrKey === "/api/skills";
  const resetDisabled = resetting || noFilters;

  const filterCheckboxChangeHandler = (index, items) => {
    return items.map((item, delta) =>
      index === delta ? { ...item, checked: !item.checked } : item,
    );
  };

  const filterSelectChangeHandler = (value, comp, prev) => {
    return { ...prev, value, comp };
  };

  const schoolFilterChangeHandler = (index) => {
    setSchoolFilters((prev) => filterCheckboxChangeHandler(index, prev));
  };

  const typeFilterChangeHandler = (index) => {
    setTypeFilters((prev) => filterCheckboxChangeHandler(index, prev));
  };

  const distanceFilterChangeHandler = (index) => {
    setDistanceFilters((prev) => filterCheckboxChangeHandler(index, prev));
  };

  const keywordFilterChangeHandler = (index) => {
    setKeywordFilters((prev) => filterCheckboxChangeHandler(index, prev));
  };

  const airOkChangeHandler = () => {
    setAirOk((prev) => !prev);
  };

  const costFilterChangeHandler = (value, comp) => {
    setCostFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const strFilterChangeHandler = (value, comp) => {
    setStrFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const velocityFilterChangeHandler = (value, comp) => {
    setVelocityFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const homingFilterChangeHandler = (value, comp) => {
    setHomingFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const recoveryFilterChangeHandler = (value, comp) => {
    setRecoveryFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const useFilterChangeHandler = (value, comp) => {
    setUseFilters((prev) => filterSelectChangeHandler(value, comp, prev));
  };

  const copyFiltersHandler = (e) => {
    e.preventDefault();

    const buf = Buffer.from(JSON.stringify(buildParams));
    navigator.clipboard.writeText(
      `https://${window.location.hostname}/?filters=${buf.toString("base64")}`,
    );
  };

  const resetFiltersHandler = (e) => {
    e.preventDefault();

    setResetting(true);

    startTransition(() => {
      setFilteredSkills(skills);
      setSchoolFilters(allSchoolFilters);
      setTypeFilters(allTypeFilters);
      setDistanceFilters(allDistanceFilters);
      setAirOk(false);
      setCostFilters(allCosts);
      setStrFilters(allStr);
      setKeywordFilters(allKeywords);
      setVelocityFilters(allVelocity);
      setHomingFilters(allHoming);
      setRecoveryFilters(allRecovery);
      setUseFilters(allUse);
    });
  };

  useEffect(() => {
    if (isValidating === false && data) {
      setResetting(false);
      setFilteredSkills(new Set(data));
    }
  }, [data, isValidating]);

  useEffect(() => {
    if (isReady) {
      if (queryFilters) {
        try {
          const buf = Buffer.from(queryFilters, "base64");
          const filters = JSON.parse(buf.toString());

          filters.school &&
            setSchoolFilters((prev) =>
              prev.map((f) =>
                filters.school.includes(f.name) ? { ...f, checked: true } : f,
              ),
            );
          filters.type &&
            setTypeFilters((prev) =>
              prev.map((f) =>
                filters.type.includes(f.name) ? { ...f, checked: true } : f,
              ),
            );
          filters.distance &&
            setDistanceFilters((prev) =>
              prev.map((f) =>
                filters.distance.includes(f.name) ? { ...f, checked: true } : f,
              ),
            );
          filters.air && setAirOk(filters.air);
          filters.cost &&
            setCostFilters((prev) => {
              return { ...prev, value: filters.cost, comp: filters.costOp };
            });
          filters.str &&
            setStrFilters((prev) => {
              return { ...prev, value: filters.str, comp: filters.strOp };
            });
          filters.keyword &&
            setKeywordFilters((prev) =>
              prev.map((f) =>
                filters.keyword.includes(f.name) ? { ...f, checked: true } : f,
              ),
            );
          filters.use &&
            setUseFilters((prev) => {
              return { ...prev, value: filters.use, comp: filters.useOp };
            });
          filters.velocity &&
            setVelocityFilters((prev) => {
              return {
                ...prev,
                value: filters.velocity,
                comp: filters.velocityOp,
              };
            });
          filters.homing &&
            setHomingFilters((prev) => {
              return { ...prev, value: filters.homing, comp: filters.homingOp };
            });
          filters.recovery &&
            setRecoveryFilters((prev) => {
              return {
                ...prev,
                value: filters.recovery,
                comp: filters.recoveryOp,
              };
            });

          startTransition(() => {
            setDisplaySkills(true);
          });
        } catch (error) {
          console.log("Filters found but unable to decode.");
          setDisplaySkills(true);
        }
      } else {
        setDisplaySkills(true);
      }
    }
  }, [isReady, queryFilters]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Phantom Dust Skills</title>
        <meta name="description" content="Phantom Dust skill list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`flex min-h-screen flex-col items-center py-16`}>
        <h1
          className={`mb-16 text-center text-5xl font-bold text-[#eee] md:text-7xl`}
        >
          Phantom Dust Skill List
        </h1>

        <form className="flex flex-col flex-wrap items-center justify-center gap-4 p-4 md:flex-row">
          <Fieldset
            type="checkboxes"
            fieldsetName="School"
            filters={schoolFilters}
            onChange={schoolFilterChangeHandler}
          />
          <Fieldset
            type="checkboxes"
            fieldsetName="Type"
            filters={typeFilters}
            onChange={typeFilterChangeHandler}
          />
          <Fieldset
            type="checkboxes"
            fieldsetName="Distance"
            filters={distanceFilters}
            onChange={distanceFilterChangeHandler}
          />
          <Fieldset
            type="checkboxes"
            fieldsetName="Air"
            filters={[{ name: "Performable in the air?", checked: airOk }]}
            onChange={airOkChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Cost"
            filters={costFilters}
            onChange={costFilterChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Str/Def"
            filters={strFilters}
            onChange={strFilterChangeHandler}
          />
          <Fieldset
            type="checkboxes"
            fieldsetName="Keywords"
            filters={keywordFilters}
            onChange={keywordFilterChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Uses"
            filters={useFilters}
            onChange={useFilterChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Velocity"
            filters={velocityFilters}
            onChange={velocityFilterChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Homing"
            filters={homingFilters}
            onChange={homingFilterChangeHandler}
          />
          <Fieldset
            type="select"
            fieldsetName="Recovery"
            filters={recoveryFilters}
            onChange={recoveryFilterChangeHandler}
          />
          <div className="flex flex-col flex-wrap gap-3">
            <button
              disabled={noFilters}
              className={`flex items-center gap-2 text-[#eee] ${
                noFilters && "cursor-not-allowed"
              }`}
              title="Copy a link with your filters"
              onClick={copyFiltersHandler}
            >
              <FaCopy /> Copy Filter Link
            </button>
            <button
              disabled={resetDisabled}
              className={`bg-slate-300 px-4 py-2 ${
                resetDisabled ? "cursor-not-allowed" : ""
              }`}
              onClick={resetFiltersHandler}
            >
              {resetting ? "Resetting...." : "Reset Filters"}
            </button>
          </div>
        </form>

        <div
          className={`mt-8 flex w-full flex-col flex-wrap justify-center gap-6 px-4 align-top md:flex-row`}
        >
          {displaySkills &&
            skills &&
            skills.map((skill) => (
              <Skill
                visible={noFilters || filteredSkills.has(skill.id)}
                key={skill.id}
                skill={skill}
              />
            ))}
        </div>
      </main>

      <footer className="pb-8 text-center text-[#eee]">
        <p>
          Site created by{" "}
          <a
            className="underline hover:no-underline"
            href="mailto:jesmasterha@gmail.com"
          >
            Jesmaster
          </a>
        </p>
        <p>
          <a
            rel="noreferrer"
            target="_blank"
            className="underline hover:no-underline"
            href="https://github.com/Jesmaster/pd-skills"
          >
            https://github.com/Jesmaster/pd-skills
          </a>
        </p>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const skills = await getSkills({}, false);
  const allSchoolFilters = ["Psycho", "Optical", "Nature", "Ki", "Faith"].map(
    (item) => {
      return { name: item, checked: false };
    },
  );
  const allTypeFilters = [
    "Attack",
    "Defense",
    "Erase",
    "Environment",
    "Status",
    "Special",
  ].map((item) => {
    return { name: item, checked: false };
  });
  const allDistanceFilters = [
    "short",
    "medium",
    "long",
    "all",
    "self",
    "auto",
    "mine",
    "capsule",
  ].map((item) => {
    return { name: item, checked: false };
  });
  const allCosts = {
    items: ["", 0, 1, 2, 3, 4, 5, 6, 7, 8, 99, "X"],
    comp: "eq",
    value: "",
  };
  const allStr = {
    items: ["", 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, "X"],
    comp: "eq",
    value: "",
  };
  const allKeywords = [
    "Absorb",
    "Arc",
    "Barrier",
    "Brush",
    "Course",
    "Crawl",
    "Fall",
    "Hole",
    "Move",
    "Object",
    "Parabola",
    "Rain",
    "Reflect",
    "Shelter",
  ].map((item) => {
    return { name: item, checked: false };
  });
  const allUse = { items: ["", 1, 2, 3, 5, "inf"], comp: "eq", value: "" };

  const rankings = ["", 1, 2, 3, 4, 5];
  const allVelocity = { items: rankings, comp: "eq", value: "" };
  const allHoming = { items: rankings, comp: "eq", value: "" };
  const allRecovery = { items: rankings, comp: "eq", value: "" };

  const allFilteredSkills = skills.map((skill) => skill.id);

  return {
    props: {
      allSchoolFilters,
      allTypeFilters,
      allDistanceFilters,
      allCosts,
      allStr,
      allKeywords,
      allVelocity,
      allHoming,
      allRecovery,
      allFilteredSkills,
      allUse,
      skills,
    },
  };
}
