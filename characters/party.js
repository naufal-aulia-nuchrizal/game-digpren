export class party {
  constructor(members = []) {
    this.members = members;
  }

  // Ambil semua anggota hidup
  getAliveMembers() {
    return this.members.filter(member => member.isAlive());
  }

  // Cek jika semua anggota mati
  isAllDead() {
    return this.getAliveMembers().length === 0;
  }

  // Ambil anggota berdasarkan index
  getMember(index) {
    return this.members[index];
  }

  // Panjang party
  get length() {
    return this.members.length;
  }

  // Iterasi langsung ke anggota
  forEach(callback) {
    this.members.forEach(callback);
  }

  // Ambil semua anggota (untuk UI atau status bar)
  getAllMembers() {
    return this.members;
  }

  // Revive semua anggota yang mati (50% HP)
  reviveAll() {
  this.members.forEach(member => {
    if (member.isDead) {
      member.currentHp = Math.max(1, Math.floor(member.maxHp * 0.5));
      member.isDead = false;
      member.hasPlayedDead = false; // ⬅️ Reset flag agar bisa mati lagi nanti
      member.animationState = "idle";

      // Pastikan animasi idle langsung ditampilkan
      if (member.animator) {
        member.animator.play("idle", true);
      }
    }
  });
}

}
