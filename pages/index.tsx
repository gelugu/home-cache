import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { randomString } from "../helpers";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { push } = useRouter();
  const toast = useToast();
  const [roomId, setRoomId] = useState("");
  const [newRoomId, setNewRoomId] = useState(randomString());

  const createRoom = useCallback(async () => {
    const data = await fetch(`/api/${newRoomId}`, { method: "POST" });
    if (data.status < 400) {
      const id = (await data.json()).id;
      toast({
        title: "Room created.",
        description: `id: ${id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      push(`/${id}`);
    } else {
      toast({
        title: "Can't create a room.",
        description: `Data: ${JSON.stringify(await data.json())}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [newRoomId]);

  const joinRoom = useCallback(() => {
    push(`/${roomId}`);
  }, [roomId]);

  return (
    <div>
      <Head>
        <title>Rooms</title>
      </Head>

      <Center h="100vh" w="100vw">
        <Box>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Join room</Tab>
              <Tab>Create room</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack>
                  <Input
                    placeholder="Room id"
                    value={roomId}
                    onChange={({ target }) => setRoomId(target.value)}
                  />
                  <ButtonGroup variant="solid">
                    <Button isDisabled={roomId === ""} onClick={joinRoom}>
                      Join room
                    </Button>
                  </ButtonGroup>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack>
                  <Input
                    placeholder="Type a new room id"
                    value={newRoomId}
                    onChange={({ target }) => setNewRoomId(target.value)}
                  />
                  <ButtonGroup variant="solid">
                    <Button isDisabled={newRoomId === ""} onClick={createRoom}>
                      Create room
                    </Button>
                    <Button onClick={() => setNewRoomId(randomString())}>
                      Generate
                    </Button>
                  </ButtonGroup>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>
    </div>
  );
};

export default Home;
