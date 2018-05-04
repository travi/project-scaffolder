import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import * as githubScaffolder from '../../../src/vcs/github';
import scaffoldVcsHost from '../../../src/vcs/host';

suite('vcs host scaffolder', () => {
  let sandbox;
  const projectName = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that hosting details are returned', () => {
    const host = any.string();

    return assert.becomes(scaffoldVcsHost({host, projectName}), {host, owner: 'travi', name: projectName}).then(() => {
      assert.notCalled(githubScaffolder.default);
    });
  });

  test('that github is scaffolded if github was chosen as the host', () => {
    const host = 'GitHub';
    const projectRoot = any.string();
    const projectType = any.string();
    const description = any.sentence();
    githubScaffolder.default.resolves();

    return assert.becomes(
      scaffoldVcsHost({host, projectName, projectRoot, projectType, description}),
      {host, owner: 'travi', name: projectName}
    ).then(() => assert.calledWith(githubScaffolder.default, {projectRoot, projectType, description}));
  });
});
