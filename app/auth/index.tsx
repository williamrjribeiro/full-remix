import * as React from "react";
import { Amplify } from 'aws-amplify';
import type { EnvVars } from "~/utils";

export default function initAuth({userPoolId, userPoolWebClientId}: EnvVars) {
  const config = {
    Auth: {
      region: 'us-east-1',
      userPoolId,
      userPoolWebClientId,
    }
  };
  
  Amplify.configure({ ...config });
}
