import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import type { RootLoaderData } from '~/root';
import { useMatchesData } from "~/utils";

const AmplifyInit = () => {
  const { ENV } = useMatchesData("root") as RootLoaderData;

  useEffect(() => {
    Amplify.configure({
      Auth: {
        userPoolId: ENV.userPoolId,
        userPoolWebClientId: ENV.userPoolWebClientId
      }
    })
  }, [ENV])

  return null;
}

export default AmplifyInit;
