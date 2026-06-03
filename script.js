class Rocket {
  #fuelLevel = 100;
  constructor(name, payloadCapacityKg, reusable) {
    this.name = name;
    this.payloadCapacityKg = payloadCapacityKg;
    this.reusable = reusable;
  }
  refuel() {
    this.#fuelLevel = 100;
  }
  consumeFuel(amount) {
  if (amount < 0) {
    throw new Error("Fuel amount cannot be negative");
  }

  if (this.#fuelLevel - amount < 0) {
    throw new Error("Insufficient fuel");
  }

  this.#fuelLevel -= amount;
}
  isReadyToLaunch() {
    return this.#fuelLevel >= 80;
  }
  toString() {
    return `🚀 ${this.name} | Capacity: ${this.payloadCapacityKg}kg | Reusable: ${
  this.reusable ? "Yes" : "No"
} | Fuel: ${this.#fuelLevel}%`;
  }
}

class Crew {
  #members = [];
  constructor(maxSize = 7) {
    this.maxSize = maxSize;
  }
  addMember({ name, role }) {
    if (this.#members.length >= this.maxSize) {
      throw new Error(`Crew is full! Max size is ${this.maxSize}`);
    }
    this.#members.push({ name, role });
  }
  hasCommander() {
    let isCommander = false;
    this.#members.forEach((member) => {
      if (member.role === "Commander") {
        isCommander = true;
      }
    });
    return isCommander;
  }
  getSize() {
    return this.#members.length;
  }
  isReady() {
    return this.#members.length >= 1 && this.hasCommander();
  }
  getManifest() {
    const lines = this.#members.map((member, index) => {
      return `  ${index + 1}. ${member.name} — ${member.role}`;
    });

    return `=== Crew (${this.#members.length}/${this.maxSize}) ===\n${lines.join("\n")}`;
  }
}

class Mission {
  #status = "planned";
  #log = [];
  static #count = 0;

  constructor(name, rocket, payloadKg) {
    this.name = name;
    this.rocket = rocket;
    this.payloadKg = payloadKg;
    this.id = Mission.generateId();
    this.#addLog("planned");
  }

  static generateId() {
    Mission.#count++;
    return `MSN-${String(Mission.#count).padStart(3, "0")}`;
  }
#addLog(event) {
  this.#log.push({
    event,
    timestamp: new Date()
  });
}
  validate() {
    if (!this.rocket.isReadyToLaunch()) {
      throw new Error("Rocket is not ready!");
    }
    if (this.payloadKg > this.rocket.payloadCapacityKg) {
      throw new Error("Payload exceeds rocket capacity!");
    }
  }


  launch() {
    try {
    this.validate();

    this.rocket.consumeFuel(80);

    if (Math.random() < 0.7) {
      this.#status = "success";
      this.#addLog("launched → success");
    } else {
      this.#status = "failed";
      this.#addLog("launched → failed");
    }

    return this.#status === "success"
      ? `${this.id} '${this.name}' launched successfully!`
      : `${this.id} '${this.name}' failed on launch.`;

  } catch (err) {
    this.#addLog(`launch aborted → ${err.message}`);
    throw err;
  }
  }

  getLog() {
    return this.#log
      .map(({ event, timestamp }) => {
        const date = timestamp
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);

        return `[${date}] ${event}`;
      })
      .join("\n");
  }


  toString() {
    return `${this.id} '${this.name}' | Status: ${this.#status}`;
  }
  
}

class CrewedMission extends Mission {
  constructor(name, rocket, payloadKg, crew) {
    super(name, rocket, payloadKg);
    this.crew = crew;
  }

  validate() {
  super.validate();

  if (this.crew.getSize() === 0) {
    throw new Error("Crew is not ready: no crew members assigned");
  }

  if (!this.crew.hasCommander()) {
    throw new Error("Crew is not ready: no Commander assigned");
  }
}

  toString() {
    return `🧑‍🚀 ${super.toString()} | Crew: ${this.crew.getSize()}`;
  }
}


const rocket = new Rocket('Crew Dragon', 6000, true);
const crew = new Crew(4);
crew.addMember({ name: 'Eileen Collins', role: 'Commander' });

const mission = new CrewedMission('Crew-8', rocket, 5000, crew);
console.log(mission.toString());


console.log(mission.launch());
console.log(mission.getLog());

rocket.refuel();
const badCrew = new Crew();
badCrew.addMember({ name: 'Bob', role: 'Pilot' });
try {
  new CrewedMission('Bad Trip', rocket, 100, badCrew).launch();
} catch (err) {
  console.error("❌", err.message);
}
