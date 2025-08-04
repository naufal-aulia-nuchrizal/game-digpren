export class skill {
    /**
     * @param {object} config
     * @param {string} config.key - kode unik skill (misal: atk1, atk2, sp_atk)
     * @param {string} config.name - nama skill
     * @param {number} config.power - jumlah damage/heal yang diberikan skill
     * @param {"damage" | "heal"} config.type - tipe skill, apakah damage atau heal
     * @param {"enemy" | "ally"} config.target - target skill, apakah ke musuh atau ke teman
     * @param {string} [config.description] - deskripsi skill (opsional)
     * @param {number} [config.cost] - biaya MP/energi (opsional)
     */
    constructor({ key, name, power, type, target, description = "", cost = 0 }) {
        this.key = key; // misal: atk1, atk2, atk3, sp_atk
        this.name = name;
        this.power = power;
        this.type = type; // "damage" or "heal"
        this.target = target; // "enemy" or "ally"
        this.description = description;
        this.cost = cost;
    }

    /**
     * gunakan skill ke target
     * @param {character} caster - karakter yang menggunakan skill
     * @param {character} target - target skill
     */
    use(caster, target) {
        if (this.type === "damage") {
            const damage = caster.atk + this.power;
            target.takeDamage(damage);
            return `${caster.name} menggunakan skill ${this.name} ke ${target.name} dan memberikan damage ${damage}.`;
        }
        if (this.type === "heal") {
            target.heal(this.power);
            return `${caster.name} menggunakan skill ${this.name} ke ${target.name} dan memulihkan ${this.power} HP.`;
        }
        return `${this.name} tidak memiliki efek yang dikenali.`;
    }
}