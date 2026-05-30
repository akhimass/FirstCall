"""
Table of Contents:
 * # Metric Definition
 * # How to Use
 * #### Adding Metrics
 * #### Running Metrics
"""

# Metric Definition

Metrics are essential tools for evaluating AI Voice Agents, acting as judges that assess call quality. They analyze call transcripts and sometimes recordings to provide scores based on specific criteria. This evaluation covers aspects like clarity, relevance, and instruction following. By assigning scores, metrics help identify strengths and areas for improvement. Regular analysis of these metrics enables organizations to make data-driven decisions, enhancing voice agent performance and user satisfaction.

# How to Use

#### Adding Metrics

From the metrics section on Cekura’s dashboard a user can add/define metrics. Metrics can be broadly categorised as:
* **Pre-defined Metrics**: Generic metrics such as CSAT, pitch, latency, and interruption count.
* **Instruction Following Metric**: Automatically find and categorize issues in the call based on agent description.
* **Custom Metrics (User-defined)**: Metrics defined by the user (Boolean, Rating, and Enum).

#### Running Metrics

* **Testing**: Each evaluator has a list of metrics attached to it. When running simulations, the metric linked to each evaluator is computed.
* **Observability**: We pick relevant metric to run at the end of the call depending on how the call went.
"""
