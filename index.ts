//Challenge 1: The Blind Parser
function hasKey<K extends string>(obj: object, key: K): obj is Record<K, unknown> { return key in obj; }

function getUserNameFromJSON(jsonString: string): string | null {
  let data: unknown;

  try {
    data = JSON.parse(jsonString);
  } catch {
    return null;
  }

  if (typeof data !== "object" || data === null) return null;

  if (!hasKey(data, "user")) return null;
  if (typeof data["user"] !== "object" || data["user"] === null) return null;

  if (!hasKey(data["user"], "name")) return null;       
  if (typeof data["user"]["name"] !== "string") return null; 

  return data.user.name;
}

console.log(getUserNameFromJSON('{"user":{"name":"Alice"}}'));
console.log(getUserNameFromJSON('{"user":{"age":25}}'));       
console.log(getUserNameFromJSON('{"wrong":"shape"}'));      


//Challenge 2: Context-Aware Returns

function fetchUser(identifier: number): { id: number, status: string }
function fetchUser(identifier: string): { username: string, status: string }

function fetchUser(identifier: number | string) {
  if (typeof identifier === 'number') {
    return { id: identifier, status: 'active' };
  } else {
    return { username: identifier, status: 'active' };
  }
}

const userById = fetchUser(101);       
console.log(userById.id);



//Challenge 3: Modeling the Unknown

interface User {
  id: string,
  username: string,
  email: string,
  isActive: boolean,
  personalInfo: IPersonalInfo,
  roles: TRoles[],
  lastLogin?: string
}

interface IPersonalInfo {
    firstName: string,
    lastName: string,
    age: number,
    phone: null | string,
}

type TRoles = "user"| "editor"

const activeUser: User = {
  id: "e3b0c442",
  username: "intern_01",
  email: "intern@example.com",
  isActive: true,
  personalInfo: { firstName: "Ivan", lastName: "Ivanov", age: 22, phone: null },
  roles: ["user", "editor"],
  lastLogin: "2023-10-25T12:00:00Z",
};

const newUser: User = {
  id: "abc123",
  username: "new_user",
  email: "new@example.com",
  isActive: false,
  personalInfo: { firstName: "Jane", lastName: "Doe", age: 20, phone: "+447700900000" },
  roles: ["user"],

};



//Challenge 4: Eliminating Impossible States

type Status = ILoading | ISuccess | IError;

interface ILoading {
  status: 'loading',

}
interface ISuccess {
  status: 'success',
  data: string[];
}
interface IError {
  status: 'error',
  errorMessage: string;
}

function renderUI(state: Status) {
  if (state.status === 'loading') {
    return "Loading...";
  }
  if (state.status === 'success') {
   
    return `Data: ${state.data.join(', ')}`;
  }
  if (state.status === 'error') {

    return `Error: ${state.errorMessage.toUpperCase()}`;
  }

  const _exhaustiveCheck: never = state;
  throw new Error(`Unhandled state: ${_exhaustiveCheck}`);
}

console.log(renderUI({ status: 'loading' }));
console.log(renderUI({ status: 'success', data: ['item1', 'item2'] }));
console.log(renderUI({ status: 'error', errorMessage: 'not found' }));



//Challenge 5: The Flexible Extractor

function pluck<T, K extends keyof T>(items: T[], key:K ):T[K][] {
  return items.map(item => item[key]);
}

const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob",   age: 30 },
];

const names = pluck(users, "name"); 
const ages  = pluck(users, "age");  

console.log(names);
console.log(ages);



//Challenge 6: The DRY Architecture

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

type CreatePayload = Omit<Product, "id" | "createdAt" | "updatedAt">
type UpdatePayload = Pick<Product, "id"> & Partial<Omit<Product, "id">>
type ClientPreview = Readonly<Pick<Product, "id" | "title" | "price">>

const create: CreatePayload = { title: "Widget", description: "A fine widget", price: 9.99, discount: 0 };
const update: UpdatePayload = { id: "abc-123", price: 12.99 };
const preview: ClientPreview = { id: "abc-123", title: "Widget", price: 9.99 };



//Challenge 7: The Amnesic Array

interface Cat { type: 'cat'; meow: () => void; }
interface Dog { type: 'dog'; bark: () => void; }

const animals: (Cat | Dog | undefined | null)[] = [
  { type: 'cat', meow: () => console.log('Meow') },
  null,
  { type: 'dog', bark: () => console.log('Woof') },
  undefined,
];

function isCat (animal:Cat | Dog | undefined | null ):animal is Cat{
  return animal !== null && animal !== undefined && animal.type === 'cat'
}

function isNonNullable <T>(value:T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

const cats = animals.filter(isCat); 
cats.forEach(cat => cat.meow());
console.log(cats.length); 

const defined = animals.filter(isNonNullable); 
console.log(defined.length);



//Challenge 8: The Deep Freeze

interface AppConfig {
  version: string;
  settings: {
    theme: string;
    features: {
      beta: boolean;
    };
  };
}

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

const config: DeepReadonly<AppConfig> = {
  version: "1.0",
  settings: {
    theme: "light",
    features: { beta: true },
  },
};



//Challenge 9: The Dynamic Emitter

interface StoreState {
  theme: string;
  volume: number;
  isMuted: boolean;
}

type TEvent = `${keyof StoreState}Changed`

type StripChanged<S> = S extends `${infer Key extends keyof StoreState}Changed` ? Key : never

function subscribe<E extends TEvent>(event: E, callback: (val: StoreState[StripChanged<E>]) => void) {
}

subscribe("themeChanged", (val) => console.log(val));

      

//Challenge 10: The Core Extractor

type Awaited_<T> = T extends Promise<infer Inner> ? Awaited_<Inner> : T

function fetchUserProfile() {
  return Promise.resolve({ id: 1, avatarUrl: "https://..." });
}

type ProfileData = Awaited_<ReturnType<typeof fetchUserProfile>>;

const profile: ProfileData = { id: 1, avatarUrl: "https://example.com/avatar.png" };

type T1 = Awaited_<Promise<string>>;          
type T2 = Awaited_<Promise<Promise<number>>>; 
type T3 = Awaited_<boolean>; 