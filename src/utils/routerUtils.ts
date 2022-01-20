import queryString from 'qs';

const genQueryParams = (data: any, ignoreEmpty = true) => {
  const newData: any = {};

  if (data) {
    Object.keys(data).map((item) => {
      if (ignoreEmpty) {
        if (data[item]) newData[item] = data[item];
      } else {
        newData[item] = data[item];
      }
    });
  }

  return newData;
};

export const queryStringGenerate = (
  params: any,
  arrayFormat: 'indices' | 'brackets' | 'repeat' | 'comma' | undefined = 'repeat',
) => queryString.stringify(genQueryParams(params), { arrayFormat: arrayFormat });
