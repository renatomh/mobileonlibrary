import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

/* API Communication */
import api from '../services/api';

/* Tnterfaces */
import { User } from '../models/users/user';

/* API CRUD interfaces */
export interface SortData {
  property: string;
  direction: 'asc' | 'desc';
}

export interface FilterData {
  property: string;
  value: string | null | Array<string>;
  anyMatch: boolean;
  joinOn: 'and' | 'or';
  operator:
    | 'like'
    | 'ilike'
    | 'notlike'
    | 'notilike'
    | '=='
    | '!='
    | '<'
    | '<='
    | '>'
    | '>='
    | 'in'
    | 'not_in'
    | 'between';
}

export interface ApiCrudData {
  route: string;
  page?: number;
  limit?: number;
  sort?: Array<SortData>;
  filter?: Array<FilterData>;
  timezone?: string;
}

export interface ApiLoadData {
  route: string;
  id: number;
}

export interface Response {
  data?: any;
  meta: { success: boolean; count?: number; errors?: any };
}

/* API Crud Context */
interface ApiCrudContextData {
  /* States */
  loading: boolean;
  setLoading: any;
  users: Array<User> | undefined;
  setUsers: any;
  /* Methods */
  loadCrudData(data: ApiCrudData): Promise<Response | null>;
  loadData(data: ApiLoadData): Promise<Response | null>;
}

/* Creating and initializing the context */
const ApiCrudContext = createContext<ApiCrudContextData>(
  {} as ApiCrudContextData,
);

/* Provider component */
const ApiCrudProvider: React.FC = ({ children }) => {
  /* States */
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  /* Function called when componetn is rendered */
  useEffect(() => {
    /* eslint-disable-next-line */
    console.log('Rendered apiCrud');
  }, []);

  /* General API CRUD load function */
  const loadCrudData = useCallback(
    async (data: ApiCrudData): Promise<Response | null> => {
      setLoading(true);
      /* Request params */
      const params = {};
      /* We can ignore the ts errors here */
      /* eslint-disable-next-line */
      /* @ts-expect-error */
      if (data.page) params.page = data.page.toString();
      /* eslint-disable-next-line */
      /* @ts-expect-error */
      if (data.limit) params.limit = data.limit.toString();
      /* eslint-disable-next-line */
      /* @ts-expect-error */
      if (data.sort) params.sort = JSON.stringify(data.sort);
      /* eslint-disable-next-line */
      /* @ts-expect-error */
      if (data.filter) params.filter = JSON.stringify(data.filter);
      /* eslint-disable-next-line */
      /* @ts-expect-error */
      if (data.timezone) params.timezone = data.timezone.toString();
      /* Making the API request */
      const res = await api
        .get(data.route, { params })
        .then(response => {
          setLoading(false);
          /* Returning response data */
          return response.data;
        })
        .catch(err => {
          /* eslint-disable-next-line */
        console.log(err);
          setLoading(false);
          return null;
        });
      return res;
    },
    [],
  );

  /* General API load function */
  const loadData = useCallback(
    async (data: ApiLoadData): Promise<Response | null> => {
      setLoading(true);
      /* Making the API request */
      const res = await api
        .get(`${data.route}/${data.id}`)
        .then(response => {
          setLoading(false);
          /* Returning response data */
          return response.data;
        })
        .catch(err => {
          /* eslint-disable-next-line */
        console.log(err);
          setLoading(false);
          return null;
        });
      return res;
    },
    [],
  );

  return (
    /* Exporting context's properties and methods */
    <ApiCrudContext.Provider
      value={{
        /* States */
        loading,
        setLoading,
        users,
        setUsers,
        /* Methods */
        loadCrudData,
        loadData,
      }}
    >
      {children}
    </ApiCrudContext.Provider>
  );
};

/* Function to use the context */
function useApiCrud(): ApiCrudContextData {
  const context = useContext(ApiCrudContext);
  /* Checking if the context was created/used */
  if (!context) {
    /* If not, throws an error */
    throw new Error('useApiCrud must be used within an ApiCrudProvider');
  }
  return context;
}

export { ApiCrudProvider, useApiCrud };
