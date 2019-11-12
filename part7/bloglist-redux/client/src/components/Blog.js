import React, { useState } from "react"
import { connect } from "react-redux"
import { likeBlog, deleteBlog, addComment } from "../reducers/blogReducer"
import { setNotification } from "../reducers/notificationReducer"
import { useField } from "../hooks/index"

const Blog = props => {
  const [formComment, setFormComment] = useState("")

  const blog = props.blog
  if (blog === undefined || !blog) {
    return null
  }

  const notify = (message, type) => {
    props.setNotification({ message, type })
    setTimeout(
      () => props.setNotification({ message: null, type: null }),
      10000
    )
  }

  const deleteBlogFromList = blog => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    try {
      props.deleteBlog(blog.id)
      notify(`Blog ${blog.title} by ${blog.author} successfully removed!`)
    } catch (exception) {
      notify(`Error encountered: ${exception}`)
    }
  }

  const handleForm = event => {
    setFormComment(event.target.value)
  }

  const newComment = async event => {
    event.preventDefault()
    try {
      await props.addComment(props.blog, formComment)
      notify(`Comment added!`)
      setFormComment("")
    } catch (exception) {
      notify(`Error encountered: ${exception}`)
    }
  }

  const details = () => (
    <div className="details">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button onClick={() => props.likeBlog(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      <div>
        {" "}
        <h3>Comments</h3>
        <form onSubmit={newComment}>
          <input type="text" value={formComment} onChange={handleForm} />
          <button type="submit">Add Comment</button>
        </form>
        <ul>
          {blog.comments.map(comment => (
            <li key={comment.id}>{comment.comment}</li>
          ))}
        </ul>
      </div>
      <div>{userCanDelete()}</div>
    </div>
  )

  const userCanDelete = () => {
    if (blog.user && props.loggedId === blog.user.id) {
      return (
        <div>
          <button onClick={() => deleteBlogFromList(blog)}>Delete</button>
        </div>
      )
    }
  }

  return <div>{details()}</div>
}

const mapStateToProps = state => {
  return {
    loggedId: state.login.id //need to get this to compare if user is user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    likeBlog: blog => dispatch(likeBlog(blog)),
    addComment: (blog, comment) => dispatch(addComment(blog, comment)),
    deleteBlog: blogId => dispatch(deleteBlog(blogId)),
    setNotification: (message, type) => {
      dispatch(setNotification(message, type))
    }
  }
}

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   like: PropTypes.func.isRequired,
//   remove: PropTypes.func.isRequired,
//   loggedInUser: PropTypes.bool.isRequired
// }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog)