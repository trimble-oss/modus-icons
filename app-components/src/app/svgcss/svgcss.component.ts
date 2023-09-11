import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svgcss',
  templateUrl: './svgcss.component.html',
  styles: [],
})
export class SvgcssComponent implements OnInit {
  @Input() svg: string;
  @Input() raw?: boolean = false;
  symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
  quotes = {
    level1: `"`,
    level2: `'`,
  };

  constructor() { }

  ngOnInit(): void {
    // trim leading and trailing double quotes
    this.svg = this.svg.replace(/^"(.*)"$/, `$1`);
  }

  getSvgCss() {
    const namespaced = this.addNameSpace(this.svg);
    const escaped = this.encodeSVG(namespaced);
    const resultCss = `${this.quotes.level1}data:image/svg+xml,${escaped}${this.quotes.level1}`;
    return resultCss;
  }

  addNameSpace(data) {
    if (data.indexOf(`http://www.w3.org/2000/svg`) < 0) {
      data = data.replace(
        /<svg/g,
        `<svg xmlns=${this.quotes.level2}http://www.w3.org/2000/svg${this.quotes.level2}`
      );
    }
    return data;
  }

  encodeSVG(data) {
    data = data.replace(/(\\n)/g, ``);
    data = data.replace(/\\/g, ``);
    data = data.replace(/"/g, `'`);
    data = data.replace(/""/g, `"`);
    data = data.replace(/class='[\w\s-]*'/g, ``);
    data = data.replace(/fill='[\w\s-]*'/g, ``);
    data = data.replace(/>\s{1,}</g, `><`);
    data = data.replace(/\s{2,}/g, ` `);

    // Using encodeURIComponent() as replacement function
    // allows to keep result code readable
    return data.replace(this.symbols, encodeURIComponent);
  }
}
