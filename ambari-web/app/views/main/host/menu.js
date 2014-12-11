/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');

App.MainHostMenuView = Em.CollectionView.extend({
  tagName: 'ul',
  classNames: ["nav", "nav-tabs"],
  host: null,
  content: function () {
    //count Alerts badge text and class

    var criticalWarningCount = this.get('host.criticalWarningAlertsCount');
    var criticalCount = this.get('host.alertsSummary.CRITICAL');
    var warningCount = this.get('host.alertsSummary.WARNING');
    var badgeText = "" + criticalWarningCount;
    var badgeClasses = "label ";
    if (criticalCount > 0) {
      badgeClasses += "label-important";
    } else if (warningCount > 0) {
      badgeClasses += "label-warning ";
    }

    var array = [
      {
        label: Em.I18n.t('common.summary'),
        routing: 'summary'
      },
      {
        label: Em.I18n.t('common.configs'),
        routing: 'configs'
      },
      {
        label: Em.I18n.t('hosts.host.alerts.label'),
        routing: 'alerts',
        badgeText: badgeText,
        badgeClasses: badgeClasses
      }
      /* { label:'Audit', routing:'audit'} */
    ];
    if (App.get('supports.stackUpgrade')) {
      array.push({
        label: Em.I18n.t('hosts.host.menu.stackVersions'),
        routing: 'stackVersions'
      });
    }
    return array;
  }.property('host.alertsSummary.CRITICAL', 'host.alertsSummary.WARNING', 'host.criticalWarningAlertsCount'),

  init: function () {
    this._super();
    this.activateView();
  },

  activateView: function () {
    var defaultRoute = App.router.get('currentState.name') || "summary";
    $.each(this._childViews, function () {
      this.set('active', (this.get('content.routing') == defaultRoute ? "active" : ""));
    });
  },

  deactivateChildViews: function () {
    $.each(this._childViews, function () {
      this.set('active', "");
    });
  },

  itemViewClass: Em.View.extend({
    classNameBindings: ["active"],
    active: "",
    template: Ember.Handlebars.compile('<a {{action hostNavigate view.content.routing }} href="#"> {{unbound view.content.label}} ' +
    '{{#if view.content.badgeText}} ' +
    '<span {{bindAttr class="view.content.badgeClasses"}}> ' +
    '{{view.content.badgeText}}' +
    '</span>  {{/if}}</a>')
  })
});