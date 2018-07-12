package registries

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/portainer/portainer"
	httperror "github.com/portainer/portainer/http/error"
	"github.com/portainer/portainer/http/request"
	"github.com/portainer/portainer/http/response"
)

type registryCreatePayload struct {
	Name           string
	URL            string
	Authentication bool
	Username       string
	Password       string
}

func (payload *registryCreatePayload) Validate(r *http.Request) error {
	if govalidator.IsNull(payload.Name) {
		return portainer.Error("Invalid registry name")
	}
	if govalidator.IsNull(payload.URL) {
		return portainer.Error("Invalid registry URL")
	}
	if payload.Authentication && (govalidator.IsNull(payload.Username) || govalidator.IsNull(payload.Password)) {
		return portainer.Error("Invalid credentials. Username and password must be specified when authentication is enabled")
	}
	return nil
}

func (handler *Handler) registryCreate(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	var payload registryCreatePayload
	err := request.DecodeAndValidateJSONPayload(r, &payload)
	if err != nil {
		return &httperror.HandlerError{http.StatusBadRequest, "Invalid request payload", err}
	}

	registries, err := handler.RegistryService.Registries()
	if err != nil {
		return &httperror.HandlerError{http.StatusInternalServerError, "Unable to retrieve registries from the database", err}
	}
	for _, r := range registries {
		if r.URL == payload.URL {
			return &httperror.HandlerError{http.StatusConflict, "A registry with the same URL already exists", portainer.ErrRegistryAlreadyExists}
		}
	}

	registry := &portainer.Registry{
		Name:            payload.Name,
		URL:             payload.URL,
		Authentication:  payload.Authentication,
		Username:        payload.Username,
		Password:        payload.Password,
		AuthorizedUsers: []portainer.UserID{},
		AuthorizedTeams: []portainer.TeamID{},
	}

	err = handler.RegistryService.CreateRegistry(registry)
	if err != nil {
		return &httperror.HandlerError{http.StatusInternalServerError, "Unable to persist the registry inside the database", err}
	}

	hideFields(registry)
	return response.JSON(w, registry)
}
