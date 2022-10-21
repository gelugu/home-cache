import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  ButtonGroup,
  Center,
  CircularProgress,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const Home: NextPage = () => {
  const { query } = useRouter();
  const toast = useToast();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotExist, setIsNotExist] = useState(false);

  const getMessage = useCallback(async () => {
    if (query.id === undefined) return;

    const data = await fetch(`/api/${query.id}/message`);
    if (data.status < 400) {
      const message = (await data.json()).message;
      setMessage(message);
    } else {
      toast({
        title: "Can't get a message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsNotExist(true);
    }
    setIsLoading(false);
  }, [query]);

  useEffect(() => {
    getMessage();
  }, [query]);

  const saveMessage = useCallback(async () => {
    const data = await fetch(`/api/${query.id}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.status < 400) {
      const id = (await data.json()).id;
      toast({
        title: "Message saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Can't save the message.",
        description: `Data: ${JSON.stringify(await data.json())}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [message]);

  return (
    <div>
      <Head>
        <title>{query.id}</title>
      </Head>

      {isLoading ? (
        <CircularProgress isIndeterminate />
      ) : (
        <Center h="100vh" w="100vw">
          {isNotExist ? (
            <Text>Room is not exist</Text>
          ) : (
            <>
              <Stack>
                <Textarea
                  w="60vw"
                  h="80vh"
                  value={message}
                  onChange={({ target }) => setMessage(target.value)}
                />
                <ButtonGroup onClick={saveMessage}>
                  <Button>Save</Button>
                </ButtonGroup>
              </Stack>
            </>
          )}
        </Center>
      )}
    </div>
  );
};

export default Home;
