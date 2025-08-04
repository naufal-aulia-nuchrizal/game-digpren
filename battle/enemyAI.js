// battle/EnemyAI.js

export const EnemyAI = {

    
    /**
    *@param {Character} boss
    *@param {Party} heroParty
    *@returns {Object} - { type: 'attack', target: Character }
    */

    chooseAction(boss, heroParty) {
        const targets = heroParty.getAliveMembers();

        if (targets.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * targets.length);
        const target = targets[randomIndex];

        return {
            type: 'attack',
            target: target
        }
    }}
