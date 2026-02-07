export default class Experience {
  constructor(canvas) {
    // Global access
    // To get access in the console
    // Last declared instance will overwrite the previous ones
    window.experience = this;

    // Options
    this.canvas = canvas;
  }
}
