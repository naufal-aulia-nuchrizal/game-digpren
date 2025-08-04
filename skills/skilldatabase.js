import { skill } from "./skill.js";

export const skilldatabase = {
  // Warrior
  Slash:    new skill({ key: "atk1", name: "Slash", power: 15, type: "damage", target: "enemy" }),
  Double:   new skill({ key: "atk2", name: "Double Slash", power: 25, type: "damage", target: "enemy" }),
  Triple:   new skill({ key: "atk3", name: "Triple Slash", power: 35, type: "damage", target: "enemy" }),
  Ultimate: new skill({ key: "sp_atk", name: "Ultimate Slash", power: 60, type: "damage", target: "enemy" }),

  // Mage
  Fireball: new skill({ key: "atk1", name: "Fireball", power: 18, type: "damage", target: "enemy" }),
  Ice:      new skill({ key: "atk2", name: "Ice Shard", power: 28, type: "damage", target: "enemy" }),
  Thunder:  new skill({ key: "atk3", name: "Thunderbolt", power: 38, type: "damage", target: "enemy" }),
  Meteor:   new skill({ key: "sp_atk", name: "Meteor Storm", power: 65, type: "damage", target: "enemy" }),

  // Guardian
  Shield:   new skill({ key: "atk1", name: "Shield Bash", power: 12, type: "damage", target: "enemy" }),
  Wind:     new skill({ key: "atk2", name: "Wind Cutter", power: 22, type: "damage", target: "enemy" }),
  Storm:    new skill({ key: "atk3", name: "Storm Strike", power: 32, type: "damage", target: "enemy" }),
  Tornado:  new skill({ key: "sp_atk", name: "Tornado Spin", power: 55, type: "damage", target: "enemy" })
};