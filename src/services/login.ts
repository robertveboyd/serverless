import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

const login = async (email: string, password: string) => {
  const client = new CognitoIdentityProviderClient();

  const adminInitiateAuthParams = {
    AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
    UserPoolId: process.env.COGNITO_USER_POOL,
    ClientId: process.env.COGNITO_USER_POOL_CLIENT,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const adminInitiateAuthCommand = new AdminInitiateAuthCommand(
    adminInitiateAuthParams
  );

  const response = await client.send(adminInitiateAuthCommand);

  return response.AuthenticationResult?.IdToken;
};

export default login;
