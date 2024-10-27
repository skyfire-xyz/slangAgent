import { Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaCog } from "react-icons/fa";
import { getSessionData, setSessionData } from "../utils/session-storage";

export default function APIKeyConfig() {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const skyFireKey = getSessionData("LOCAL_SKYFIRE_API_KEY");
  const activeAPIKey = skyFireKey || "********";

  return (
    <div>
      <FaCog
        className="h-6 w-6 cursor-pointer text-white"
        onClick={() => setShowConfig(true)}
      />
      <Modal
        show={showConfig}
        size="md"
        onClose={() => {
          setShowConfig(false);
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              <p className="text-sm">
                API Key: {activeAPIKey.replace(/.(?=.{4})/g, "*")}
              </p>
            </h3>
            <div className="mb-10 flex items-center justify-center gap-2 text-white">
              <TextInput
                placeholder={"Skyfire API Key"}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                color="gray"
                onClick={() => {
                  setSessionData("LOCAL_SKYFIRE_API_KEY", apiKey);
                  setApiKey("");
                  setShowConfig(false);
                }}
              >
                {!apiKey ? "Use Default" : "Save"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
