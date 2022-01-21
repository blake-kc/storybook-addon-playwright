import React, { useCallback } from 'react';
import { ActionList } from '../actions/ActionList';
import { ActionSet } from '../../typings';
import { Snackbar, Loader, ListItemWrapper, InputDialog } from '../common';
import { Divider } from '@mui/material';
import { useActionSchemaLoader, useActionEditor } from '../../hooks';
import { ActionSetEditorIcons } from './ActionSetEditorIcons';
import { TEMP_ACTION_SET } from '../../constants';
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(
  (theme: Theme) => {
    const {
      palette: { secondary },
    } = theme;

    return {
      divider: {
        backgroundColor: secondary.main,
      },
      root: {
        height: '100%',
      },
    };
  },
  { name: 'ActionSetEditor' },
);

interface Props {
  actionSet: ActionSet;
}

const ActionSetEditor: React.FC<Props> = ({ actionSet }) => {
  const [editDescription, setEditDescription] = React.useState(false);

  const {
    handleAddAction,
    handleDescriptionChange,
    handleSave,
    clearValidationResult,
    validationResult,
    cancelEditActionSet,
  } = useActionEditor(actionSet);

  const classes = useStyles();

  const { loading } = useActionSchemaLoader();

  const toggleEditDescription = useCallback(() => {
    setEditDescription(!editDescription);
  }, [editDescription]);

  const saveDescription = useCallback(
    (desc: string) => {
      handleDescriptionChange(desc);
      setEditDescription(!editDescription);
    },
    [editDescription, handleDescriptionChange],
  );

  return (
    <ListItemWrapper
      tooltip={
        actionSet.temp ? actionSet.title + TEMP_ACTION_SET : actionSet.title
      }
      title={actionSet.temp ? `${actionSet.title} *` : actionSet.title}
      draggable={true}
      selected={true}
      secondaryColor={true}
      icons={
        <ActionSetEditorIcons
          onAddAction={handleAddAction}
          onCancel={cancelEditActionSet}
          onEditTitle={toggleEditDescription}
          onSave={handleSave}
        />
      }
    >
      <div className={classes.root}>
        <Divider className={classes.divider} />
        <ActionList actionSet={actionSet} />

        {validationResult && (
          <Snackbar
            open={true}
            onClose={clearValidationResult}
            variant="error"
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            autoHideDuration={60000}
            closeIcon={true}
          >
            <div style={{ width: 300 }}>
              {validationResult.map((result) => {
                return (
                  <div key={result.id}>
                    {result.required && (
                      <div key={result.id}>
                        <div>Action name: {result.name}</div>
                        <div style={{ fontSize: 12, marginLeft: 5 }}>
                          Required: {result.required.join(',')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Snackbar>
        )}
        <Loader open={loading} />
        {editDescription && (
          <InputDialog
            title="Edit Description"
            value={actionSet.title}
            open={true}
            onClose={toggleEditDescription}
            onSave={saveDescription}
          />
        )}
      </div>
    </ListItemWrapper>
  );
};

ActionSetEditor.displayName = 'ActionSetEditor';

export { ActionSetEditor };
