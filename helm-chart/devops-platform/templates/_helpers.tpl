{{/*
_helpers.tpl — Reusable named templates for devops-platform chart
These are included in all other templates with {{ include "devops-platform.xxx" . }}
*/}}

{{/*
Expand the name of the chart.
*/}}
{{- define "devops-platform.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
Truncated at 63 chars because Kubernetes names have a limit.
*/}}
{{- define "devops-platform.fullname" -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels — added to every resource
These help identify which resources belong to this release
*/}}
{{- define "devops-platform.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "devops-platform.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Backend selector labels — used in Deployment + Service to match pods
*/}}
{{- define "devops-platform.backendLabels" -}}
app.kubernetes.io/name: {{ include "devops-platform.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Frontend selector labels — used in Deployment + Service to match pods
*/}}
{{- define "devops-platform.frontendLabels" -}}
app.kubernetes.io/name: {{ include "devops-platform.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
PostgreSQL selector labels
*/}}
{{- define "devops-platform.postgresLabels" -}}
app.kubernetes.io/name: {{ include "devops-platform.name" . }}-postgres
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}