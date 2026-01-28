import { formatTime } from '../utils/day';
import { getConfig } from '../config';

export class Breadcrumb {
  private max = 20;
  private stack: any[] = [];

  init() {
    const config = getConfig();
    this.max = config.maxBreadcrumb;
  }

  push(event: any) {
    if (this.stack.length >= this.max) this.stack.shift();
    this.stack.push({ ...event, time: formatTime(new Date()) });
  }

  getStack() {
    return [...this.stack];
  }

  clear() {
    this.stack = [];
  }
}

export const breadcrumb = new Breadcrumb();