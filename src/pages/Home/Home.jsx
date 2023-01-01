import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";

function Home() {
  const [textInput, setTextInput] = useState(null);
  const [membersArray, setMembersArray] = useState([]);
  const [shuffledGroup, setShuffledGroup] = useState([]);
  const [groupSize, setGroupSize] = useState(null);
  const [numberOfGroups, setNumberOfGroups] = useState(null);
  const [groupVisibility, setGroupVisibility] = useState(false);
  const [finalGroups, setFinalGroups] = useState([]);
  const [groupArray, setGroupArray] = useState([]);

  const results = useRef();

  function handlePeopleChange(e) {
    setTextInput(e.target.value);
  }
  function handleGroupSizeChange(e) {
    setGroupSize(e.target.value);
  }
  function amountOfGroups(groupSize) {
    let numberOfGroupsTemp;
    let groupArrayTemp = [[""]];
    // console.log(`groupSize ${groupSize}`);
    //find out if the rest of people is an own group or needs to be distributed
    if (membersArray.length % groupSize <= groupSize / 2) {
      numberOfGroupsTemp = membersArray.length / groupSize;
      numberOfGroupsTemp = numberOfGroupsTemp - (numberOfGroupsTemp % 1);
    } else {
      numberOfGroupsTemp = membersArray.length / groupSize;
      numberOfGroupsTemp = numberOfGroupsTemp - (numberOfGroupsTemp % 1) + 1;
    }

    //extend empty groupArray with necessary empty arrays to fill
    for (let l = 0; l < numberOfGroupsTemp - 1; l++) {
      groupArrayTemp.push([""]);
    }
    setGroupArray(groupArrayTemp);
    setNumberOfGroups(numberOfGroupsTemp);
  }

  //only uses the program when clicking on the regroup button
  function handleButtonClick(e) {
    if (groupSize && textInput) {
      e.preventDefault();
      setGroupArray([[]]);
      setMembersArray(textInput.replaceAll(" ", "").split(","));
    }
  }

  useEffect(() => {
    amountOfGroups(groupSize);
    // eslint-disable-next-line
  }, [membersArray]);

  useEffect(() => {
    //shuffle the group names
    let shuffledGroupTemp = membersArray.sort(() => {
      return Math.random() - 0.5;
    });
    setShuffledGroup(shuffledGroupTemp);
    // eslint-disable-next-line
  }, [groupArray]);

  //distribute people into groups
  useEffect(() => {
    let errorOut = 0;
    let checkI;

    if (shuffledGroup.length) {
      if (groupArray.length > 0) {
        for (let i = 0; i < membersArray.length; i++) {
          if (i > 0 || i === membersArray.length) {
            //to fix the problem with the loop (missing people or undefined result)
            i--;
          }
          for (let j = 1; j <= numberOfGroups; j++) {
            // NEW CODE - Create Object
            // check if there is value on position i in shuffledGroup & if not, end program
            if (shuffledGroup[i] === undefined) {
              setFinalGroups(groupArray);
              return;
            }
            if (checkI === i) {
              i++;
            }
            if (groupArray[j - 1] && shuffledGroup[i]) {
              groupArray[j - 1].push(shuffledGroup[i]);
            }
            checkI = i;

            i++;
            if (i === membersArray.length - 1 && errorOut !== 1) {
              i--;
              errorOut = 1;
            }
          }
        }
      }
    }
    setFinalGroups(groupArray);
    // eslint-disable-next-line
  }, [shuffledGroup]);

  useEffect(() => {
    if (finalGroups.length > 1) setGroupVisibility(true);
    results.current.scrollIntoView({ behavior: "smooth" });
  }, [finalGroups]);

  return (
    <div className={styles.container}>
      <h1 className={styles.main_hl}>Wow! A group generator!</h1>
      <p className={styles.description}>
        This group generator is simple. List all people that you want to split
        in groups <span>separated by a comma</span> and hit the "Let's Regroup"
        Button.
      </p>
      <p>
        Ahmed, Andrei, Georg, Hendra, Lars, Lera, Luis, Marianne, Mathieu,
        Mulugeta, Nevin, Oriane
      </p>
      <section>
        <form id="shuffleGroup" action="#">
          <div className={styles.input_area}>
            <div className={styles.label_input_group}>
              <label htmlFor="allNames" className={styles.field_hl}>
                List all members:
              </label>
              <textarea
                id="allNames"
                name="allNames"
                className={styles.input_field}
                placeholder="Add names, comma seperated"
                onChange={handlePeopleChange}
                required
              />
            </div>
            <div className={styles.label_input_group}>
              <label htmlFor="groupSize" className={styles.field_hl}>
                people per group:
              </label>
              <input
                type="text"
                id="groupSize"
                placeholder="-"
                name="groupSize"
                required
                onChange={handleGroupSizeChange}
                size="10"
              />
            </div>
          </div>
          <button
            form="shuffleGroup"
            id="shuffleButton"
            onClick={handleButtonClick}
          >
            Let's Regroup!
          </button>
        </form>
      </section>
      <div className={styles.group_assignment} ref={results}>
        {groupVisibility &&
          finalGroups.map((el, index) => {
            return (
              <div key={index} className={styles.group_container}>
                <h3>Group {index + 1}</h3>
                <div>
                  {el.map((elem, index2) => {
                    return index2 > 0 && <p key={index2}>{elem}</p>;
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
