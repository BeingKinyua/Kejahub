import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BuildingBlocksLoader } from '../src/components/ui/BuildingBlocksLoader';

describe('BuildingBlocksLoader Component', () => {
  it('renders default contained variant with accessible status role', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuildingBlocksLoader, {
        label: 'Constructing your portfolio…',
      })
    );

    // Verify accessible role
    assert.ok(html.includes('role="status"'), 'Should have role="status"');
    assert.ok(html.includes('Constructing your portfolio…'), 'Should render the provided label');
    assert.ok(html.includes('kb-building-grid'), 'Should render the 3x3 building grid');
    assert.ok(html.includes('kb-roofline'), 'Should render the architectural roofline');
    assert.ok(html.includes('kb-window'), 'Should render window details');
    assert.ok(html.includes('kb-doorway'), 'Should render the ground-floor doorway');
  });

  it('renders inline variant with compact structure for buttons and chips', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuildingBlocksLoader, {
        size: 'sm',
        variant: 'inline',
        label: 'Authenticating…',
        showLabel: true,
      })
    );

    assert.ok(html.includes('inline-flex'), 'Should use inline-flex layout');
    assert.ok(html.includes('Authenticating…'), 'Should render label');
    assert.ok(html.includes('sr-only'), 'Should render screen-reader text');
  });

  it('renders fullscreen variant with KejaHub wordmark and brand subtitle', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuildingBlocksLoader, {
        size: 'lg',
        variant: 'fullscreen',
        label: 'Verifying your workspace access…',
      })
    );

    assert.ok(html.includes('fixed inset-0'), 'Should cover full viewport');
    assert.ok(html.includes('KEJAHUB'), 'Should include brand wordmark');
    assert.ok(html.includes('Kenya Property AI Operations'), 'Should include subtitle');
    assert.ok(html.includes('Verifying your workspace access…'), 'Should include label');
  });

  it('renders completion state with checkmark badge and completed class', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuildingBlocksLoader, {
        size: 'md',
        completionState: true,
        completionMessage: 'Your workspace is ready',
      })
    );

    assert.ok(html.includes('kb-building-completed'), 'Should apply kb-building-completed class');
    assert.ok(html.includes('Your workspace is ready'), 'Should show completion message');
    assert.ok(html.includes('lucide-check-circle-2') || html.includes('CheckCircle2') || html.includes('svg'), 'Should render confirmation check indicator');
  });

  it('renders all 9 modular blocks correctly', () => {
    const html = renderToStaticMarkup(
      React.createElement(BuildingBlocksLoader, {
        size: 'md',
      })
    );

    for (let i = 1; i <= 9; i++) {
      assert.ok(html.includes(`kb-block-${i}`), `Should contain block kb-block-${i}`);
    }
  });
});
