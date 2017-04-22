export class Issue {

  private _lat: string;
  private _long: string;
  private _title: string;
  private _description: string;
  private _photos: string[];
  private _author: string;
  private _likes: number;
  private _solved: boolean;

	constructor() {
	}

  public get lat(): string {
    return this._lat;
  }

  public set lat(value: string) {
    this._lat = value;
  }


	public get long(): string {
		return this._long;
	}

	public set long(value: string) {
		this._long = value;
	}


	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}


	public get description(): string {
		return this._description;
	}

	public set description(value: string) {
		this._description = value;
	}


	public get photos(): string[] {
		return this._photos;
	}

	public set photos(value: string[]) {
		this._photos = value;
	}


	public get author(): string {
		return this._author;
	}

	public set author(value: string) {
		this._author = value;
	}


	public get likes(): number {
		return this._likes;
	}

	public set likes(value: number) {
		this._likes = value;
	}


	public get solved(): boolean {
		return this._solved;
	}

	public set solved(value: boolean) {
		this._solved = value;
	}


}
