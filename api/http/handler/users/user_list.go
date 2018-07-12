package users

import (
	"net/http"

	httperror "github.com/portainer/portainer/http/error"
	"github.com/portainer/portainer/http/response"
	"github.com/portainer/portainer/http/security"
)

// GET request on /api/users
func (handler *Handler) userList(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	users, err := handler.UserService.Users()
	if err != nil {
		return &httperror.HandlerError{http.StatusInternalServerError, "Unable to retrieve users from the database", err}
	}

	securityContext, err := security.RetrieveRestrictedRequestContext(r)
	if err != nil {
		return &httperror.HandlerError{http.StatusInternalServerError, "Unable to retrieve info from request context", err}
	}

	filteredUsers := security.FilterUsers(users, securityContext)

	for _, user := range filteredUsers {
		hideFields(&user)
	}
	return response.JSON(w, filteredUsers)
}
