import React from "react";
import { getPasswordMessage } from "../../utils/authValidation";

const PasswordHint = ({ password, requireStrong = false }) => {
  if (!password) return null;

  const message = getPasswordMessage(password, { requireStrong });
  if (!message) return null;

  return (
    <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
      {message}
    </p>
  );
};

export default PasswordHint;
