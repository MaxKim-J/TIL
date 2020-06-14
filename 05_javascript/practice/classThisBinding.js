const Test = class {
  constructor(name) {
    this.name = name
  }
  say() {
    console.log(this.name)
    console.log(this)
  }
  sayloud() {
    this.say;
    console.log("loud")
  }
}

const a = new Test("종혁");
a.say();
a.sayloud();