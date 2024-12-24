import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  GlobalStateProvider,
  ChangeGlobalStateProvider,
} from './useGlobalState';
import { globalState } from './globalState';

export default function GlobalState({ children }) {
  const [stateProps, setStateProps] = useState(globalState);

  const updateGlobalState = async (action, payload) => {
    const updatedState = await action(stateProps, payload, updateGlobalState);

    updatedState && setStateProps(updatedState);
  };

  return (
    <GlobalStateProvider value={stateProps}>
      <ChangeGlobalStateProvider value={updateGlobalState}>
        {children}
      </ChangeGlobalStateProvider>
    </GlobalStateProvider>
  );
}

GlobalState.propTypes = {
  children: PropTypes.element.isRequired,
};
