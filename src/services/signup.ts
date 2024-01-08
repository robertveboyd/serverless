import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";

const signup = async (email: string, password: string) => {
  const client = new CognitoIdentityProviderClient();

  const adminCreateUserParams = {
    UserPoolId: process.env.COGNITO_USER_POOL,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: MessageActionType.SUPPRESS,
  };

  const adminCreateUserCommand = new AdminCreateUserCommand(
    adminCreateUserParams
  );

  const response = await client.send(adminCreateUserCommand);

  if (response.User) {
    const adminSetUserPasswordParams = {
      Password: password,
      UserPoolId: process.env.COGNITO_USER_POOL,
      Username: email,
      Permanent: true,
    };
    const adminSetUserPasswordCommand = new AdminSetUserPasswordCommand(
      adminSetUserPasswordParams
    );

    await client.send(adminSetUserPasswordCommand);
  }
};

export default signup;
