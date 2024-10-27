import { Modal } from "flowbite-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function APIKeyModal({
  showSignup,
  onClose,
}: {
  showSignup: boolean;
  onClose: () => void;
}) {
  const [isSignup, setIsSignup] = useState(false);
  return (
    <Modal size={"sm"} show={showSignup} onClose={onClose}>
      <Modal.Header>API Key Not Set</Modal.Header>
      <Modal.Body>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isSignup ? "signup" : "signin"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Please visit Skyfire Dashboard to create an API Key. And set{" "}
            <kbd>SKYFIRE_API_KEY</kbd> in your <kbd>.env</kbd> file.
          </motion.div>
        </AnimatePresence>
      </Modal.Body>
    </Modal>
  );
}
